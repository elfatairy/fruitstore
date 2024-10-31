import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { createClient, exportItem, exportItemsHelper, getAllClients, getClient, getClientReceiptsHelper } from '../backend/clients';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOT_ENOUGH_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { getReceipt } from '../backend/receipts';
import Layout from './Layout';
import { Client, PageType, Receipt, Supplier } from '../types';
import { NavLink, useParams } from 'react-router-dom';
import { getSupplier, getSupplierReceiptsHelper } from '../backend/suppliers';

export default function SupplierPage() {
    const { db } = useAuth();
    const { supplierUid } = useParams();
    const [first, setFirst] = useState(true);
    const [supplier, setSupplier] = useState<Supplier>();
    const [receipts, setReceipts] = useState<Map<string, Receipt>>();


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

    const exportItems = async (clientUuid: string, moneyPaid: number, items: exportItem[]) => {
        try {
            const receiptUuid = await exportItemsHelper(db!, clientUuid, moneyPaid, items);
            if (receiptUuid) {
                console.log("receipt");
                console.log(receiptUuid);
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

    useEffect(() => {
        if (supplierUid) {
            getSupplierDetails(supplierUid);
            getSupplierReceipts(supplierUid);
        }

        if (first) {
            setFirst(false);
            // getReceiptDetails("qiq3adDDVBBsvHLN9dyk");
            // exportItems("Qu2rJVh5vyDxUapqd4iK", 100, [
            //     {
            //         itemUuid: "Zx1SqeVgqxBOOQjsI0Y6",
            //         mass: 5,
            //         boxes: 1,
            //         price: 20
            //     }
            // ]);
        }
    }, []);

    if (!supplier) {
        return <div>
            Loading....
        </div>
    }

    return (
        <Layout page={PageType.SUPPLIERS}>
            <div className='top'>
                <h2 className='title'><NavLink className="link" to="/suppliers">Suppliers</NavLink> / {supplier.username}</h2>
                <button className='add'>
                    <span>Import</span>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
                        <path d="M12 4L12 14M12 14L15 11M12 14L9 11" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
            <div className='bottom'>
                <div className='input-container'>
                    <input className='search' placeholder='Search Here' />
                    <svg className='icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                {
                    receipts ?
                        <table>
                            <tr>
                                <th>Receipt Number</th>
                                <th>Receipt Date</th>
                                <th>Total Price</th>
                                <th>Money Paid</th>
                            </tr>
                            {
                                [...receipts.entries()].map(([id, receipt]) => {
                                    return <tr>
                                        <td>{id}</td>
                                        <td>{receipt.createdAt.toDate().toUTCString()}</td>
                                        <td>{receipt.totalPrice}</td>
                                        <td>{receipt.moneyPaid}</td>
                                    </tr>
                                })
                            }
                        </table> :
                        <div>
                            There is no receipts yet, add a client to interact with him
                        </div>
                }
            </div>
        </Layout>
    )
}
