import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { createSupplier, getAllSuppliers } from '../backend/suppliers';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOT_ENOUGH_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import Layout from './Layout';
import { PageType, Supplier } from '../utils/types';
import { useNavigate } from 'react-router-dom';

export default function SuppliersPage() {
    const { db } = useAuth();
    const [first, setFirst] = useState(true);
    const [suppliers, setSuppliers] = useState<Map<string, Supplier>>();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [supplierName, setSupplierName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddSupplier = async () => {
        if (!supplierName.trim() || !phoneNumber.trim()) return;
        
        try {
            const key = await createSupplier(db!, supplierName, phoneNumber);
            if (key) {
                // Refresh suppliers list
                getSuppliers();
                // Reset form
                setSupplierName('');
                setPhoneNumber('');
                // Close modal
                setIsModalOpen(false);
            }
        } catch (error) {
            console.log("ERROR");
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.error('Error creating supplier');
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const getSuppliers = async () => {
        try {
            const suppliers = await getAllSuppliers(db!);
            if (suppliers) {
                setSuppliers(suppliers);
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.log("ERROR");
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    useEffect(() => {
        getSuppliers();
        if (first) {
            setFirst(false);
        }
    }, [db]);

    // Close modal if Escape key is pressed
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsModalOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    // Filter suppliers based on search query
    const filteredSuppliers = suppliers ? 
        new Map([...suppliers.entries()].filter(([_, supplier]) => 
            supplier.username.toLowerCase().includes(searchQuery.toLowerCase())
        ))
        : new Map();

    return (
        <Layout page={PageType.SUPPLIERS}>
            <div className='top'>
                <h2 className='title'>الموردين</h2>
                <button className='btn add' onClick={() => setIsModalOpen(true)}>
                    <span>إضافة مورد</span>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g id="Edit / Add_Plus">
                            <path id="Vector" d="M6 12H12M12 12H18M12 12V18M12 12V6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                    </svg>
                </button>
            </div>
            
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        
                        <h3 className="text-right mb-4 text-xl">إضافة مورد جديد</h3>
                        
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleAddSupplier();
                        }}>
                            <div className="input-container">
                                <input 
                                    placeholder="اسم المورد"
                                    value={supplierName}
                                    onChange={(e) => setSupplierName(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            
                            <div className="input-container">
                                <input 
                                    placeholder="رقم الهاتف"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="submit"
                                    className="btn add"
                                >
                                    إضافة
                                </button>
                                <button 
                                    type="button"
                                    className="btn pay"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className='bottom'>
                <div className='input-container'>
                    <input 
                        className='search' 
                        placeholder='ابحث هنا'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg className='icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className='bottom-contnet'>
                    {
                        suppliers ? (
                            filteredSuppliers.size > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>الرصيد</th>
                                            <th>الرقم</th>
                                            <th>الاسم</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            [...filteredSuppliers.entries()].map(([id, supplier]) => {
                                                return <tr key={id} onClick={() => navigate(`/suppliers/${id}`)}>
                                                    <td>{supplier.balance}</td>
                                                    <td>{supplier.number}</td>
                                                    <td>{supplier.username}</td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            ) : (
                                <div>لا يوجد موردين مطابقين لبحثك</div>
                            )
                        ) : (
                            <div>
                                لا يوجد موردين حتى الآن، أضف مورد للتفاعل معه
                            </div>
                        )
                    }
                </div>
            </div>
        </Layout>
    )
}