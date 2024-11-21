import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { createClient, getAllClients } from '../backend/clients';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOT_ENOUGH_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { getReceipt } from '../backend/receipts';
import Layout from './Layout';
import { Client, PageType } from '../utils/types';
import { useNavigate } from 'react-router-dom';

export default function ClientsPage() {
    const { db } = useAuth();
    const [first, setFirst] = useState(true);
    const [clients, setClients] = useState<Map<string, Client>>();
    const navigate = useNavigate();

    const addClient = async (clientName: string, number: string) => {
        try {
            const key = await createClient(db!, clientName, number);
            if (key) {
                console.log(key);
                // JOE: Handle successul creation
            }
        } catch (error) {
            console.log("ERROR");
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                    // JOE: add this feature
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const getClients = async () => {
        try {
            const clients = await getAllClients(db!);
            if (clients) {
                console.log("clients");
                console.log(clients);
                setClients(clients);
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
        // addClient("Ahmed", "01021853989");
        getClients();
        // getClientDetails("t3Djn4ODbjMoBEzfwTz7");

        if (first) {
            setFirst(false);
            // getClientReceipts("Qu2rJVh5vyDxUapqd4iK");
            // getReceiptDetails("qiq3adDDVBBsvHLN9dyk");
            // exportItem("G0JsI0EIrO0V125fy6m8", [
            //     {
            //         itemUuid: "ObqGXhTQ9qzLpR3Ksx4v",
            //         mass: 5,
            //         boxes: 1,
            //         price: 20
            //     }
            // ]);
        }
    }, [db]);

    return (
        <Layout page={PageType.CLIENTS}>
            <div className='top'>
                <h2 className='title'>Clients</h2>
                <button className='btn add'>
                    <span>Add New</span>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g id="Edit / Add_Plus">
                            <path id="Vector" d="M6 12H12M12 12H18M12 12V18M12 12V6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                    </svg>
                </button>
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
                        clients ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Number</th>
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        [...clients.entries()].map(([id, client]) => {
                                            return <tr key={id} onClick={() => navigate(`/clients/${id}`)}>
                                                <td>{client.username}</td>
                                                <td>{client.number}</td>
                                                <td>{client.balance}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table> :
                            <div>
                                There is no clients yet, add a client to interact with him
                            </div>
                    }
                </div>
            </div>
        </Layout>
    )
}
