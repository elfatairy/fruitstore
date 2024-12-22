import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { exportItemType, exportItemHelper, getClient, getClientReceiptsHelper, getClientItemsHelper, getClientVaultRecsHelper, createClientReceipt } from '../backend/clients';
import { FIREBASE_ERROR, FIREBASE_NOT_ENOUGH_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { getReceipt } from '../backend/receipts';
import Layout from './Layout';
import { Client, ExtendedClientItem, PageType, Receipt, VaultRec } from '../utils/types';
import { NavLink, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { formatArabicDate } from '../utils/date';
import { getPaidHelper } from '../backend/vault';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import RangePicker from '../components/RangePicker';
import { Timestamp } from 'firebase/firestore';

export default function ClientPage() {
    const { db } = useAuth();
    const { clientUuid } = useParams();
    const [first, setFirst] = useState(true);
    const [client, setClient] = useState<Client>();
    const [receipts, setReceipts] = useState<Map<string, Receipt>>();
    const [clientItems, setClientItems] = useState<Map<string, ExtendedClientItem>>();
    const [totalPrice, setTotalPrice] = useState(0);
    const [vaultRecs, setVaultRecs] = useState<Map<string, Partial<VaultRec>>>();
    const [totalMoney, setTotalMoney] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const getClientDetails = async (clientUuid: string) => {
        try {
            const client = await getClient(db!, clientUuid);
            if (client) {
                console.log("client");
                console.log(client);
                setClient(client);
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.log("ERROR");
                    // JOE: FIX this
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                } else if (error.code === FIREBASE_NOTFOUND_ERROR) {
                    // JOE
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const getClientReceipts = async (clientUuid: string) => {
        try {
            const receipts = await getClientReceiptsHelper(db!, clientUuid);
            if (receipts) {
                console.log("receipts");
                console.log(receipts);
                setReceipts(receipts);
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.log("ERROR");
                    // JOE: FIX this
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                } else if (error.code === FIREBASE_NOTFOUND_ERROR) {
                    // JOE
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const getClientItems = async (clientUuid: string, startDate?: Date, endDate?: Date) => {
        try {
            const clientItems = await getClientItemsHelper(db!, clientUuid, startDate, endDate);
            if (clientItems) {
                console.log("clientItems");
                console.log(clientItems);
                setClientItems(clientItems);
                let total = 0;
                clientItems.forEach(clientItem => {
                    total += clientItem.price * clientItem.mass;
                });
                setTotalPrice(total);
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.log("ERROR");
                    // JOE: FIX this
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                } else if (error.code === FIREBASE_NOTFOUND_ERROR) {
                    // JOE
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const getRangedData = async (startDate?: Date, endDate?: Date) => {
        if(!clientUuid) return;

        await getClientItems(clientUuid, startDate, endDate);
        await getClientVaultRecs(clientUuid, startDate, endDate);
    }

    const getClientVaultRecs = async (clientUuid: string, startDate?: Date, endDate?: Date) => {
        try {
            const vaultRecs = await getClientVaultRecsHelper(db!, clientUuid, startDate, endDate);
            if (vaultRecs) {
                console.log("vaultRecs");
                console.log(vaultRecs);
                setVaultRecs(vaultRecs);
                let total = 0;
                vaultRecs.forEach(rec => {
                    if (rec.amount)
                        total += rec.amount;
                });
                setTotalMoney(total);
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.log("ERROR");
                    // JOE: FIX this
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                } else if (error.code === FIREBASE_NOTFOUND_ERROR) {
                    // JOE
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const getPaid = async (amount: number) => {
        if (!clientUuid) return;

        try {
            const vaultRecUuid = await getPaidHelper(db!, clientUuid, amount);
            if (vaultRecUuid) {
                console.log("vaultRecUuid");
                console.log(vaultRecUuid);
                // JOE: SET THE receipt
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.log("ERROR");
                    // JOE: FIX this
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                } else if (error.code === FIREBASE_NOTFOUND_ERROR) {
                    // JOE
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const exportItem = async (clientUuid: string, item: exportItemType) => {
        try {
            const clientItemUuid = await exportItemHelper(db!, clientUuid, item);
            if (clientItemUuid) {
                console.log("clientItemUuid");
                console.log(clientItemUuid);
                // JOE: SET THE clientItemUuid
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.log("ERROR");
                    // JOE: FIX this
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                } else if (error.code === FIREBASE_NOT_ENOUGH_ERROR) {
                    // JOE
                } else if (error.code === FIREBASE_NOTFOUND_ERROR) {
                    // JOE
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const getReceiptDetails = async (receiptUuid: string) => {
        try {
            const receipt = await getReceipt(db!, receiptUuid);
            if (receipt) {
                console.log("receipt");
                console.log(receipt);
                // JOE: SET THE receipt
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.log("ERROR");
                    // JOE: FIX this
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                } else if (error.code === FIREBASE_NOTFOUND_ERROR) {
                    // JOE
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const createReceipt = async (supplierUuid: string, items: string[], vaultRecs: string[]) => {
        try {
            const receiptUuid = await createClientReceipt(db!, supplierUuid, items, vaultRecs);
            if (receiptUuid) {
                console.log("receiptUuid");
                console.log(receiptUuid);
                // JOE: SET THE receiptUuid
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.log("ERROR");
                    // JOE: FIX this
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                } else if (error.code === FIREBASE_NOT_ENOUGH_ERROR) {
                    // JOE
                } else if (error.code === FIREBASE_NOTFOUND_ERROR) {
                    // JOE
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

        // Add sorting function for client items
        const getSortedClientItems = () => {
            if (!clientItems) return [];
            return [...clientItems.entries()].sort((a, b) => 
                b[1].createdAt.toDate().getTime() - a[1].createdAt.toDate().getTime()
            );
        };
    
        // Add filter function for search
        const getFilteredClientItems = () => {
            const sorted = getSortedClientItems();
            if (!searchTerm) return sorted;
            return sorted.filter(([_, item]) => 
                `${item.productName} - ${item.supplierName} - ${formatArabicDate(item.importDate.toDate())}`.includes(searchTerm)
            );
        };


    useEffect(() => {

        if (clientUuid) {
            getClientDetails(clientUuid);
            getClientReceipts(clientUuid);
            getClientItems(clientUuid);
            getClientVaultRecs(clientUuid);
            // getPaid(200);
            // createReceipt(clientUuid, ["EpFvUzzolncUWWIsHpqk", "ivt95KQD2XamhBXHGOsF", "kEzIBSd1VBgNMamsqIwB"],  ["Dr6MHR8kf6FYMmAzwn6U", "LnjoeTo6HOi0bZtwyY20"])
        }

        if (first) {
            setFirst(false);
            // getReceiptDetails("qiq3adDDVBBsvHLN9dyk");
            // exportItem("G0JsI0EIrO0V125fy6m8", {
            //     itemUuid: "Hox8tRJgboOGRG4UePDn",
            //     mass: 5,
            //     boxes: 1,
            //     price: 20
            // });
        }
    }, []);

    if (!client) {
        return <Loading />
    }

        // Helper function to safely format dates
        const formatDateSafe = (timestamp: Timestamp | undefined) => {
            if (!timestamp) return "---";
            return formatArabicDate(timestamp.toDate());
        };


// First, let's add the receipt generation function with proper types
const generateReceiptHTML = (
    client: Client,
    filteredItems: [string, ExtendedClientItem][],
    totalPrice: number,
    vaultRecs: Map<string, Partial<VaultRec>>,
    totalMoney: number
) => {
    const currentDate = new Date();
    return `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>إيصال ${client.username}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    direction: rtl;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: right;
                }
                th {
                    background-color: #f2f2f2;
                }
                .total {
                    font-weight: bold;
                }
                .date {
                    text-align: left;
                    margin-bottom: 20px;
                }
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>إيصال ل${client.username}</h1>
                <div class="date">التاريخ: ${formatArabicDate(currentDate)}</div>
            </div>
            
            <h2>المنتجات</h2>
            <table>
                <thead>
                    <tr>
                        <th>رمز المنتج</th>
                            <th>الصناديق</th>
                            <th>الوزن</th>
                            <th>السعر/ كجم</th>
                        <th>تاريخ التصدير</th>
                        <th>السعر الإجمالي</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredItems.map(([id, item]) => `
                        <tr>
                            <td>${item.productName} - ${item.supplierName} - ${formatArabicDate(item.importDate.toDate())}</td>
                            <td>${item.boxes}</td>
                            <td>${item.mass}</td>
                            <td>${item.price}</td>
                            <td>${formatArabicDate(item.createdAt.toDate())}</td>
                            <td>${item.price * item.mass}</td>
                        </tr>
                    `).join('')}
                    <tr class="total">
                        <td colspan="4">الإجمالي</td>
                        <td>${totalPrice}</td>
                    </tr>
                </tbody>
            </table>

            <h2>المدفوعات</h2>
            <table>
                <thead>
                    <tr>
                        <th>التاريخ</th>
                        <th>المبلغ</th>
                    </tr>
                </thead>
                <tbody>
                    ${Array.from(vaultRecs.entries()).map(([id, item]) => `
                        <tr>
                            <td>${formatArabicDate(item.createdAt?.toDate() ?? new Date())}</td>
                            <td>${item.amount}</td>
                        </tr>
                    `).join('')}
                    <tr class="total">
                        <td>الإجمالي</td>
                        <td>${totalMoney}</td>
                    </tr>
                </tbody>
            </table>

            <div class="total-summary" style="text-align: left; margin-top: 20px; font-size: 18px; display : flex ; justify-content: space-around;">
                <div>إجمالي المنتجات: ${totalPrice}</div>
                <div>إجمالي المدفوعات: ${totalMoney}</div>
                <div>المتبقي: ${totalPrice - totalMoney}</div>
            </div>

            <div class="no-print">
                <button onclick="window.print()" style="    width: 130px;
    height: 40px;
    border-radius: 20px;
    font-size: x-large;"
    >طباعة</button>
            </div>
        </body>
        </html>
    `;
};

// Add the print handler function
const handlePrintReceipt = () => {
    if (!client || !clientItems || !vaultRecs) return;
    
    const filteredItems = getFilteredClientItems();
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
        receiptWindow.document.write(generateReceiptHTML(client, filteredItems, totalPrice, vaultRecs, totalMoney));
        receiptWindow.document.close();
    }
};

    
    return (
        <Layout page={PageType.CLIENTS}>
            <div className='top'>
                <h2 className='title'>
                <NavLink className="link" to="/clients">العملاء</NavLink> / {client.username} 
                <span style={{ fontSize: 16 }}>(<NavLink className="link" to={`/clients/${clientUuid}/receipts`}>الإيصالات</NavLink>)</span></h2>
                <div className='btns'>
    
                <button className='receipt btn' onClick={handlePrintReceipt}>
                    <span>إنشاء إيصال</span>
                    <svg width="800px" height="800px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.775 17.9344L6.847 18.8784C6.77321 18.9152 6.68572 18.9115 6.61528 18.8687C6.54484 18.8259 6.50131 18.7499 6.5 18.6674V5.33343C6.50165 5.25118 6.54531 5.17551 6.61569 5.13291C6.68607 5.09032 6.77337 5.08674 6.847 5.12343L8.775 6.06743C8.85208 6.10494 8.94319 6.09925 9.015 6.05243L10.567 5.03943C10.6479 4.98686 10.7521 4.98686 10.833 5.03943L12.367 6.03943C12.4479 6.09201 12.5521 6.09201 12.633 6.03943L14.167 5.03943C14.2479 4.98686 14.3521 4.98686 14.433 5.03943L15.984 6.05243C16.0558 6.09925 16.1469 6.10494 16.224 6.06743L18.153 5.12343C18.2266 5.08674 18.3139 5.09032 18.3843 5.13291C18.4547 5.17551 18.4984 5.25118 18.5 5.33343V18.6674C18.4984 18.7497 18.4547 18.8254 18.3843 18.868C18.3139 18.9106 18.2266 18.9141 18.153 18.8774L16.225 17.9334C16.1479 17.8959 16.0568 17.9016 15.985 17.9484L14.433 18.9614C14.3521 19.014 14.2479 19.014 14.167 18.9614L12.633 17.9614C12.5521 17.9089 12.4479 17.9089 12.367 17.9614L10.833 18.9614C10.7521 19.014 10.6479 19.014 10.567 18.9614L9.016 17.9484C8.94376 17.9016 8.85218 17.8963 8.775 17.9344Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.5 10.2505C9.08579 10.2505 8.75 10.5863 8.75 11.0005C8.75 11.4147 9.08579 11.7505 9.5 11.7505V10.2505ZM15.5 11.7505C15.9142 11.7505 16.25 11.4147 16.25 11.0005C16.25 10.5863 15.9142 10.2505 15.5 10.2505V11.7505ZM10.5 12.2505C10.0858 12.2505 9.75 12.5863 9.75 13.0005C9.75 13.4147 10.0858 13.7505 10.5 13.7505V12.2505ZM14.5 13.7505C14.9142 13.7505 15.25 13.4147 15.25 13.0005C15.25 12.5863 14.9142 12.2505 14.5 12.2505V13.7505ZM9.5 11.7505H15.5V10.2505H9.5V11.7505ZM10.5 13.7505H14.5V12.2505H10.5V13.7505Z" fill="#fff" />
                    </svg>
                </button>
      
                </div>
            </div>
           <div className='bottom' style={{ direction: 'rtl' }}>
                <div className='bottom-header'>
                <RangePicker getFunction={getRangedData}/>

                    <div className='input-container'>
                        <input 
                            className='search' 
                            placeholder='بحث برمز المنتج' 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className='icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                </div>

                <div className='bottom-contnet'>
                    {
                        clientItems ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>رمز المنتج</th>
                                        <th>الصناديق</th>
                                        <th>الوزن</th>
                                        <th>السعر/ كجم</th>
                                        <th>تاريخ التصدير</th>
                                        <th>السعر الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        getFilteredClientItems().map(([id, item]) => {
                                            return <tr key={id} className='nohover'>
                                                <td>{`${item.productName} - ${item.supplierName} - ${formatArabicDate(item.importDate.toDate())}`}</td>
                                                <td>{item.boxes}</td>
                                                <td>{item.mass}</td>
                                                <td>{item.price}</td>
                                                <td>{formatDateSafe(item.createdAt)}</td>
                                                <td>{item.price * item.mass}</td>
                                            </tr>
                                        })
                                    }
                                    <tr className='nohover'>
                                        <td style={{ fontWeight: '700' }}>الإجمالي</td>
                                        <td> -- </td>
                                        <td> -- </td>
                                        <td> -- </td>
                                        <td style={{ fontWeight: '700' }}>{totalPrice}</td>
                                    </tr>
                                </tbody>
                            </table> :
                            <div>
                                لا توجد إيصالات حتى الآن، أضف عميلاً للتفاعل معه
                            </div>
                    }
                    {
                        vaultRecs ?
                            <>
                                <span style={{ fontWeight: 600, fontSize: 20, margin: '10px 0', display: 'block' }}>المدفوعات</span>
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{width:'30%'}}>التاريخ</th>
                                            <th style={{width:'30%'}}>المبلغ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            [...vaultRecs.entries()].map(([id, item]) => {
                                                return <tr key={id} className='nohover'>
                                                    <td>{formatDateSafe(item.createdAt)}</td>
                                                    <td>{item.amount}</td>
                                                </tr>
                                            })
                                        }
                                        <tr className='nohover'>
                                            <td style={{ fontWeight: '700' }}>الإجمالي</td>
                                            <td style={{ fontWeight: '700' }}>{totalMoney}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </> :
                            ""
                    }
                </div>
            </div>
        </Layout>
    )
}