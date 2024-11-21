import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { FIREBASE_ERROR, FIREBASE_NOT_ENOUGH_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { getReceipt } from '../backend/receipts';
import Layout from './Layout';
import { Client, ExtendedItem, Item, PageType, Receipt, Supplier, VaultRec } from '../utils/types';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { createSupplierReceipt, getSupplier, getSupplierItemsHelper, getSupplierReceiptsHelper, getSupplierVaultRecsHelper, importItem, importItemHelper } from '../backend/suppliers';
import { showDate } from '../utils/date';
import Loading from '../components/Loading';
import { payHelper } from '../backend/vault';

export default function SupplierPage() {
    const { db } = useAuth();
    const { supplierUuid } = useParams();
    const [first, setFirst] = useState(true);
    const [supplier, setSupplier] = useState<Supplier>();
    const [receipts, setReceipts] = useState<Map<string, Receipt>>();
    const [items, setItems] = useState<Map<string, ExtendedItem>>();
    const [vaultRecs, setVaultRecs] = useState<Map<string, Partial<VaultRec>>>();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [totalMoneyPaid, setTotalMoneyPaid] = useState<number>(0);
    const navigate = useNavigate();

    const getSupplierDetails = async (supplierUuid: string) => {
        try {
            const supplier = await getSupplier(db!, supplierUuid);
            if (supplier) {
                console.log("supplier");
                console.log(supplier);
                setSupplier(supplier)
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

    const getSupplierReceipts = async (supplierUuid: string) => {
        try {
            const receipts = await getSupplierReceiptsHelper(db!, supplierUuid);
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

    const getSupplierItems = async (supplierUuid: string) => {
        try {
            const items = await getSupplierItemsHelper(db!, supplierUuid);
            if (items) {
                console.log("items");
                console.log(items);
                setItems(items);
                let _totalPrice = 0;
                items.forEach(item => {
                    _totalPrice += item.price * item.mass;
                });
                setTotalPrice(_totalPrice);
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

    const getSupplierVaultRecs = async (supplierUuid: string) => {
        try {
            const vaultRecs = await getSupplierVaultRecsHelper(db!, supplierUuid);
            if (vaultRecs) {
                console.log("vaultRecs");
                console.log(vaultRecs);
                setVaultRecs(vaultRecs);
                let total = 0;
                vaultRecs.forEach(rec => {
                    if (rec.amount)
                        total += rec.amount;
                });
                setTotalMoneyPaid(total);
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

    const pay = async (supplierUuid: string, amount: number) => {
        try {
            const vaultRecUuid = await payHelper(db!, supplierUuid, amount);
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

    const importItem = async (supplierUuid: string, item: importItem) => {
        try {
            const itemUuid = await importItemHelper(db!, supplierUuid, item);
            if (itemUuid) {
                console.log("item");
                console.log(itemUuid);
                // JOE: SET THE item
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

    const createReceipt = async (supplierUuid: string, items: string[], vaultRecs: string[]) => {
        try {
            const receiptUuid = await createSupplierReceipt(db!, supplierUuid, items, vaultRecs);
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

    useEffect(() => {
        if (supplierUuid) {
            getSupplierDetails(supplierUuid);
            getSupplierReceipts(supplierUuid);
            getSupplierItems(supplierUuid);
            getSupplierVaultRecs(supplierUuid);
            // createReceipt(supplierUuid, ["6FokRVFQiD5XnHXD8tZN", "Hg6uX9BmT3T9VxOzA8a9", "jzbvkiie0ft7GYUmlKys"],  ["AaPbOgoBFrzEwGlIEEpE", "Zcq8vXymwW6HjfqYF5UU"])
        }

        if (first) {
            // pay(supplierUuid, 200);
            setFirst(false);
            // getReceiptDetails("qiq3adDDVBBsvHLN9dyk");
        }
    }, []);

    if (!supplier) {
        return <Loading />
    }

    return (
        <Layout page={PageType.SUPPLIERS}>
            <div className='top'>
                <h2 className='title'><NavLink className="link" to="/suppliers">Suppliers</NavLink> / {supplier.username} <span style={{fontSize: 16}}>(<NavLink className="link" to={`/suppliers/${supplierUuid}/receipts`}>Receipts</NavLink>)</span></h2>
                <div className='btns'>
                    <button className='add btn'>
                        <span>Import</span>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M12 4L12 14M12 14L15 11M12 14L9 11" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button className='receipt btn'>
                        <span>Make Receipt</span>
                        <svg width="800px" height="800px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.775 17.9344L6.847 18.8784C6.77321 18.9152 6.68572 18.9115 6.61528 18.8687C6.54484 18.8259 6.50131 18.7499 6.5 18.6674V5.33343C6.50165 5.25118 6.54531 5.17551 6.61569 5.13291C6.68607 5.09032 6.77337 5.08674 6.847 5.12343L8.775 6.06743C8.85208 6.10494 8.94319 6.09925 9.015 6.05243L10.567 5.03943C10.6479 4.98686 10.7521 4.98686 10.833 5.03943L12.367 6.03943C12.4479 6.09201 12.5521 6.09201 12.633 6.03943L14.167 5.03943C14.2479 4.98686 14.3521 4.98686 14.433 5.03943L15.984 6.05243C16.0558 6.09925 16.1469 6.10494 16.224 6.06743L18.153 5.12343C18.2266 5.08674 18.3139 5.09032 18.3843 5.13291C18.4547 5.17551 18.4984 5.25118 18.5 5.33343V18.6674C18.4984 18.7497 18.4547 18.8254 18.3843 18.868C18.3139 18.9106 18.2266 18.9141 18.153 18.8774L16.225 17.9334C16.1479 17.8959 16.0568 17.9016 15.985 17.9484L14.433 18.9614C14.3521 19.014 14.2479 19.014 14.167 18.9614L12.633 17.9614C12.5521 17.9089 12.4479 17.9089 12.367 17.9614L10.833 18.9614C10.7521 19.014 10.6479 19.014 10.567 18.9614L9.016 17.9484C8.94376 17.9016 8.85218 17.8963 8.775 17.9344Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.5 10.2505C9.08579 10.2505 8.75 10.5863 8.75 11.0005C8.75 11.4147 9.08579 11.7505 9.5 11.7505V10.2505ZM15.5 11.7505C15.9142 11.7505 16.25 11.4147 16.25 11.0005C16.25 10.5863 15.9142 10.2505 15.5 10.2505V11.7505ZM10.5 12.2505C10.0858 12.2505 9.75 12.5863 9.75 13.0005C9.75 13.4147 10.0858 13.7505 10.5 13.7505V12.2505ZM14.5 13.7505C14.9142 13.7505 15.25 13.4147 15.25 13.0005C15.25 12.5863 14.9142 12.2505 14.5 12.2505V13.7505ZM9.5 11.7505H15.5V10.2505H9.5V11.7505ZM10.5 13.7505H14.5V12.2505H10.5V13.7505Z" fill="#fff" />
                        </svg>
                    </button>
                    <button className='pay btn'>
                        <span>Pay</span>
                        <svg width="800px" height="800px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.8702 16.97V18.0701C12.8702 18.2478 12.7995 18.4181 12.6739 18.5437C12.5482 18.6694 12.3778 18.74 12.2001 18.74C12.0224 18.74 11.852 18.6694 11.7264 18.5437C11.6007 18.4181 11.5302 18.2478 11.5302 18.0701V16.9399C11.0867 16.8668 10.6625 16.7051 10.2828 16.4646C9.90316 16.2241 9.57575 15.9097 9.32013 15.54C9.21763 15.428 9.16061 15.2817 9.16016 15.1299C9.16006 15.0433 9.17753 14.9576 9.21155 14.8779C9.24557 14.7983 9.29545 14.7263 9.35809 14.6665C9.42074 14.6067 9.49484 14.5601 9.57599 14.5298C9.65713 14.4994 9.7436 14.4859 9.83014 14.49C9.91602 14.4895 10.0009 14.5081 10.0787 14.5444C10.1566 14.5807 10.2254 14.6338 10.2802 14.7C10.6 15.1178 11.0342 15.4338 11.5302 15.6099V13.0701C10.2002 12.5401 9.53015 11.77 9.53015 10.76C9.55019 10.2193 9.7627 9.70353 10.1294 9.30566C10.4961 8.9078 10.9929 8.65407 11.5302 8.59009V7.47998C11.5302 7.30229 11.6007 7.13175 11.7264 7.0061C11.852 6.88045 12.0224 6.81006 12.2001 6.81006C12.3778 6.81006 12.5482 6.88045 12.6739 7.0061C12.7995 7.13175 12.8702 7.30229 12.8702 7.47998V8.58008C13.2439 8.63767 13.6021 8.76992 13.9234 8.96924C14.2447 9.16856 14.5226 9.43077 14.7402 9.73999C14.8284 9.85568 14.8805 9.99471 14.8901 10.1399C14.8928 10.2256 14.8783 10.3111 14.8473 10.3911C14.8163 10.4711 14.7696 10.5439 14.7099 10.6055C14.6502 10.667 14.5787 10.7161 14.4998 10.7495C14.4208 10.7829 14.3359 10.8001 14.2501 10.8C14.1607 10.7989 14.0725 10.7787 13.9915 10.7407C13.9104 10.7028 13.8384 10.648 13.7802 10.5801C13.5417 10.2822 13.2274 10.054 12.8702 9.91992V12.1699L13.1202 12.27C14.3902 12.76 15.1802 13.4799 15.1802 14.6299C15.163 15.2399 14.9149 15.8208 14.4862 16.2551C14.0575 16.6894 13.4799 16.9449 12.8702 16.97ZM11.5302 11.5901V9.96997C11.3688 10.0285 11.2298 10.1363 11.1329 10.2781C11.0361 10.4198 10.9862 10.5884 10.9902 10.76C10.9984 10.93 11.053 11.0945 11.1483 11.2356C11.2435 11.3767 11.3756 11.4889 11.5302 11.5601V11.5901ZM13.7302 14.6599C13.7302 14.1699 13.3902 13.8799 12.8702 13.6599V15.6599C13.1157 15.6254 13.3396 15.5009 13.4985 15.3105C13.6574 15.1202 13.74 14.8776 13.7302 14.6299V14.6599Z" fill="#fff" />
                            <path d="M12.58 3.96997H6C4.93913 3.96997 3.92178 4.39146 3.17163 5.1416C2.42149 5.89175 2 6.9091 2 7.96997V17.97C2 19.0308 2.42149 20.0482 3.17163 20.7983C3.92178 21.5485 4.93913 21.97 6 21.97H18C19.0609 21.97 20.0783 21.5485 20.8284 20.7983C21.5786 20.0482 22 19.0308 22 17.97V11.8999" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16.3398 8.57992L21.9998 2.91992" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M17.4805 2.91992H22.0005V7.44992" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className='bottom'>
                <div className='input-container'>
                    <input className='search' placeholder='Search Here' />
                    <svg className='icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className='bottom-contnet'>
                    {
                        items ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Weight</th>
                                        <th>Boxes</th>
                                        <th>Import Date</th>
                                        <th>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        [...items.entries()].map(([id, item]) => {
                                            return <tr key={id} className='nohover'>
                                                <td onClick={() => navigate(`/products/${item.productUuid}`)} className='table-link'>{item.productName}</td>
                                                <td>{item.mass}</td>
                                                <td>{item.boxes}</td>
                                                <td>{showDate(item.createdAt.toDate())}</td>
                                                <td>{item.price * item.mass}</td>
                                            </tr>
                                        })
                                    }
                                    <tr className='nohover'>
                                        <td style={{ fontWeight: '700' }}> Total </td>
                                        <td> -- </td>
                                        <td> -- </td>
                                        <td> -- </td>
                                        <td style={{ fontWeight: '700' }}>{totalPrice}</td>
                                    </tr>
                                </tbody>
                            </table> :
                            <div>
                                There is no receipts yet, add a client to interact with him
                            </div>
                    }
                    {
                        vaultRecs ?
                            <>
                                <span style={{ fontWeight: 600, fontSize: 20, marginTop: 10, marginBottom: 10 }}>Payments</span>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            [...vaultRecs.entries()].map(([id, item]) => {
                                                return <tr key={id} className='nohover'>
                                                    <td>{showDate(item.createdAt?.toDate())}</td>
                                                    <td>{item.amount}</td>
                                                </tr>
                                            })
                                        }
                                        <tr className='nohover'>
                                            <td style={{ fontWeight: '700' }}> Total </td>
                                            <td style={{ fontWeight: '700' }}>{totalMoneyPaid}</td>
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
