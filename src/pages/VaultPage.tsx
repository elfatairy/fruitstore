import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import Layout from './Layout';
import { ExtendedVaultRec, Item, PageType, Product, VaultRec, VaultRecType } from '../utils/types';
import { useNavigate } from 'react-router-dom';
import { getVaultRecsHelper } from '../backend/vault';
import { showDate } from '../utils/date';
import RangePicker from '../components/RangePicker';
import { payHelper } from '../backend/vault';
import { getPaidHelper } from '../backend/vault';
import { getAllClients } from '../backend/clients';
import { getAllSuppliers } from '../backend/suppliers';
import './styles/vaultPage.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function VaultPage() {
    const { db } = useAuth();
    const [vaultRecs, setVaultRecs] = useState<Map<string, ExtendedVaultRec>>();
    const navigate = useNavigate();
    const [profit, setProfit] = useState(0);
    const [clients, setClients] = useState<Map<string, any>>();
    const [suppliers, setSuppliers] = useState<Map<string, any>>();
    const [showCustomerPayModal, setShowCustomerPayModal] = useState(false);
    const [showSupplierPayModal, setShowSupplierPayModal] = useState(false);
    const [selectedClientUuid, setSelectedClientUuid] = useState('');
    const [selectedSupplierUuid, setSelectedSupplierUuid] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [searchClientTerm, setSearchClientTerm] = useState('');
    const [searchSupplierTerm, setSearchSupplierTerm] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
    const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
    const [filteredVaultRecs, setFilteredVaultRecs] = useState<[string, ExtendedVaultRec][]>([]);

    const getVaultRecs = async (startDate?: Date, endDate?: Date) => {
        try {
            const vaultRecs = await getVaultRecsHelper(db!, startDate, endDate);
            if (vaultRecs) {
                setVaultRecs(vaultRecs);
                // Initialize filtered records
                setFilteredVaultRecs([...vaultRecs.entries()]);
                let total = 0;
                vaultRecs.forEach(vaultRec => {
                    total += vaultRec.type == VaultRecType.OUT ? -vaultRec.amount : vaultRec.type == VaultRecType.IN ? vaultRec.amount : 0;
                });
                setProfit(total);
            }
        } catch (error) {
            console.error('حدث خطأ أثناء جلب سجلات الخزينة', error);
        }
    }

    // Update filtered records whenever search term or vault records change
    useEffect(() => {
        if (vaultRecs) {
            const filtered = [...vaultRecs.entries()].filter(([_, rec]) =>
                rec.userName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredVaultRecs(filtered);
        }
    }, [searchTerm, vaultRecs]);

    const getClients = async () => {
        try {
            const clients = await getAllClients(db!);
            if (clients) {
                setClients(clients);
            }
        } catch (error) {
            console.error('حدث خطأ أثناء جلب العملاء', error);
        }
    }

    const getSuppliers = async () => {
        try {
            const suppliers = await getAllSuppliers(db!);
            if (suppliers) {
                setSuppliers(suppliers);
            }
        } catch (error) {
            console.error('حدث خطأ أثناء جلب الموردين', error);
        }
    }

    const getRangedData = async (startDate?: Date, endDate?: Date) => {
        await getVaultRecs(startDate, endDate);
    }

    useEffect(() => {
        getVaultRecs();
        getClients();
        getSuppliers();
    }, []);

    const supplierPay = async () => {
        if (!selectedSupplierUuid || !paymentAmount) return;

        try {
            const vaultRecUuid = await payHelper(db!, selectedSupplierUuid, parseFloat(paymentAmount));
            if (vaultRecUuid) {
                setShowSupplierPayModal(false);
                setSelectedSupplierUuid('');
                setPaymentAmount('');
                await getVaultRecs();
            }
        } catch (error) {
            console.error('حدث خطأ أثناء دفع مبلغ للمورد', error);
        }
    }

    const customerPay = async () => {
        if (!selectedClientUuid || !paymentAmount) return;

        try {
            const vaultRecUuid = await getPaidHelper(db!, selectedClientUuid, parseFloat(paymentAmount));
            if (vaultRecUuid) {
                setShowCustomerPayModal(false);
                setSelectedClientUuid('');
                setPaymentAmount('');
                await getVaultRecs();
            }
        } catch (error) {
            console.error('حدث خطأ أثناء استلام مبلغ من العميل', error);
        }
    }

    const filteredClients = clients ? [...clients.entries()].filter(
        ([_, client]) => 
            client.username.toLowerCase().includes(searchClientTerm.toLowerCase()) ||
            client.phone?.includes(searchClientTerm)
    ) : [];

    const filteredSuppliers = suppliers ? [...suppliers.entries()].filter(
        ([_, supplier]) => 
            supplier.username.toLowerCase().includes(searchSupplierTerm.toLowerCase()) ||
            supplier.phone?.includes(searchSupplierTerm)
    ) : [];

    const handleClientSelect = (uuid: string, username: string) => {
        setSelectedClientUuid(uuid);
        setSearchClientTerm(username);
        setIsClientDropdownOpen(false);
    }

    const handleSupplierSelect = (uuid: string, username: string) => {
        setSelectedSupplierUuid(uuid);
        setSearchSupplierTerm(username);
        setIsSupplierDropdownOpen(false);
    }

    return (
        <Layout page={PageType.VAULT}>
            <div className='top'>
                <h2 className='title'>سجلات الخزينة</h2>
                <div className='right-data'>
                    <div className='btns'>
                        <button 
                            className='btn add customer-pay large-btn mr-2' 
                            onClick={() => setShowCustomerPayModal(true)}
                        >
                            <span>استلام من عميل</span>
                        </button>
                        <button 
                            className='btn add supplier-pay large-btn' 
                            onClick={() => setShowSupplierPayModal(true)}
                        >
                            <span>دفع لمورد</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Customer Pay Modal */}
            {showCustomerPayModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h3>استلام مبلغ من عميل</h3>
                        <div className='input-container'>
                            <input 
                                type="text" 
                                placeholder="بحث باسم أو رقم العميل" 
                                value={searchClientTerm}
                                onChange={(e) => {
                                    setSearchClientTerm(e.target.value);
                                    setIsClientDropdownOpen(true);
                                }}
                                onFocus={() => setIsClientDropdownOpen(true)}
                                className='search-input mb-2'
                            />
                            {isClientDropdownOpen && filteredClients.length > 0 && (
                                <select 
                                    size={Math.min(filteredClients.length, 5)}
                                    className='search-dropdown'
                                    onChange={(e) => {
                                        const [uuid, client] = filteredClients[parseInt(e.target.value)];
                                        handleClientSelect(uuid, client.username);
                                    }}
                                >
                                    {filteredClients.map(([uuid, client], index) => (
                                        <option key={uuid} value={index}>
                                            {client.username} - {client.number || 'لا يوجد رقم'}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <input 
                            type="number" 
                            placeholder="المبلغ" 
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className='amount-input mb-2'
                        />
                        <div className='modal-actions'>
                            <button onClick={customerPay} disabled={!selectedClientUuid || !paymentAmount}>
                                تأكيد
                            </button>
                            <button onClick={() => {
                                setShowCustomerPayModal(false);
                                setSearchClientTerm('');
                                setSelectedClientUuid('');
                            }}>
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Supplier Pay Modal */}
            {showSupplierPayModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h3>دفع مبلغ لمورد</h3>
                        <div className='input-container'>
                            <input 
                                type="text" 
                                placeholder="بحث باسم أو رقم المورد" 
                                value={searchSupplierTerm}
                                onChange={(e) => {
                                    setSearchSupplierTerm(e.target.value);
                                    setIsSupplierDropdownOpen(true);
                                }}
                                onFocus={() => setIsSupplierDropdownOpen(true)}
                                className='search-input mb-2'
                            />
                            {isSupplierDropdownOpen && filteredSuppliers.length > 0 && (
                                <select 
                                    size={Math.min(filteredSuppliers.length, 5)}
                                    className='search-dropdown'
                                    onChange={(e) => {
                                        const [uuid, supplier] = filteredSuppliers[parseInt(e.target.value)];
                                        handleSupplierSelect(uuid, supplier.username);
                                    }}
                                >
                                    {filteredSuppliers.map(([uuid, supplier], index) => (
                                        <option key={uuid} value={index}>
                                            {supplier.username} - {supplier.number || 'لا يوجد رقم'}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <input 
                            type="number" 
                            placeholder="المبلغ" 
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className='amount-input mb-2'
                        />
                        <div className='modal-actions'>
                            <button onClick={supplierPay} disabled={!selectedSupplierUuid || !paymentAmount}>
                                تأكيد
                            </button>
                            <button onClick={() => {
                                setShowSupplierPayModal(false);
                                setSearchSupplierTerm('');
                                setSelectedSupplierUuid('');
                            }}>
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='bottom'>
                <div className='bottom-header'>
                    <div className='input-container'>
                        <input 
                            className='search' 
                            placeholder='البحث هنا'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className='icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <RangePicker getFunction={getRangedData} />
                </div>
                <div className='bottom-content'>
                    {
                        vaultRecs ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>التاريخ</th>
                                        <th>المبلغ</th>
                                        <th>اسم المستخدم</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredVaultRecs.map(([id, rec]) => {
                                            return <tr key={id} className='nohover' >
                                                <td>{showDate(rec.createdAt.toDate())}</td>
                                                
                                                <td>
                                                    <div className='td-contents'>
                                                        {rec.type == VaultRecType.OUT ? <>{
                                                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M12 3.25C12.4142 3.25 12.75 3.58579 12.75 4L12.75 18.1893L17.4697 13.4697C17.7626 13.1768 18.2374 13.1768 18.5303 13.4697C18.8232 13.7626 18.8232 14.2374 18.5303 14.5303L12.5303 20.5303C12.3897 20.671 12.1989 20.75 12 20.75C11.8011 20.75 11.6103 20.671 11.4697 20.5303L5.46967 14.5303C5.17678 14.2374 5.17678 13.7626 5.46967 13.4697C5.76256 13.1768 6.23744 13.1768 6.53033 13.4697L11.25 18.1893L11.25 4C11.25 3.58579 11.5858 3.25 12 3.25Z" fill="#c0392b" />
                                                            </svg>
                                                        } <span>-</span></> :
                                                            rec.type == VaultRecType.IN ? <>{
                                                                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M6.4569 9.73276C6.17123 10.0327 6.18281 10.5074 6.48276 10.7931C6.78271 11.0788 7.25744 11.0672 7.5431 10.7672L6.4569 9.73276ZM12.5431 5.51724C12.8288 5.21729 12.8172 4.74256 12.5172 4.4569C12.2173 4.17123 11.7426 4.18281 11.4569 4.48276L12.5431 5.51724ZM12.5431 4.48276C12.2574 4.18281 11.7827 4.17123 11.4828 4.4569C11.1828 4.74256 11.1712 5.21729 11.4569 5.51724L12.5431 4.48276ZM16.4569 10.7672C16.7426 11.0672 17.2173 11.0788 17.5172 10.7931C17.8172 10.5074 17.8288 10.0327 17.5431 9.73276L16.4569 10.7672ZM12.75 5C12.75 4.58579 12.4142 4.25 12 4.25C11.5858 4.25 11.25 4.58579 11.25 5H12.75ZM11.25 19C11.25 19.4142 11.5858 19.75 12 19.75C12.4142 19.75 12.75 19.4142 12.75 19H11.25ZM7.5431 10.7672L12.5431 5.51724L11.4569 4.48276L6.4569 9.73276L7.5431 10.7672ZM11.4569 5.51724L16.4569 10.7672L17.5431 9.73276L12.5431 4.48276L11.4569 5.51724ZM11.25 5V19H12.75V5H11.25Z" fill="#27ae60" />
                                                                </svg>
                                                            } <span>+</span></> :
                                                                "?"} {rec.amount}
                                                    </div>
                                                </td>

                                                <td className='table-link' onClick={() => navigate(`/${rec.type == VaultRecType.OUT ? 'suppliers' : 'clients'}/${rec.userUuid}`)}>{rec.userName}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table> :
                            <div>
                                لا توجد سجلات خزينة بعد
                            </div>
                    }
                </div>
            </div>
        </Layout>
    )
}