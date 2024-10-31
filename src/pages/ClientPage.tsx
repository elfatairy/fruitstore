import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { createClient, exportItem, exportItemsHelper, getAllClients, getClient, getClientReceiptsHelper } from '../backend/clients';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOT_ENOUGH_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { getReceipt } from '../backend/receipts';
import Layout from './Layout';
import { Client, PageType, Receipt } from '../types';
import { NavLink, useParams } from 'react-router-dom';

export default function ClientPage() {
    const { db } = useAuth();
    const { clientUid } = useParams();
    const [first, setFirst] = useState(true);
    const [client, setClient] = useState<Client>();
    const [receipts, setReceipts] = useState<Map<string, Receipt>>();

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
        if (clientUid) {
            getClientDetails(clientUid);
            getClientReceipts(clientUid);
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

    if (!client) {
        return <div>
            Loading....
        </div>
    }

    return (
        <Layout page={PageType.CLIENTS}>
            <div className='top'>
                <h2 className='title'><NavLink className="link" to="/clients">Clients</NavLink> / {client.username}</h2>
                <button className='add'>
                    <span>Export</span>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                        <path d="M9.31995 6.49994L11.8799 3.93994L14.4399 6.49994" stroke="#fff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11.88 14.18V4.01001" stroke="#fff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 12C4 16.42 7 20 12 20C17 20 20 16.42 20 12" stroke="#fff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
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
