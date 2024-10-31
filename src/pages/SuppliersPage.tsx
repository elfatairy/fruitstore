import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOT_ENOUGH_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { createSupplier, getAllSuppliers, getSupplier, getSupplierReceiptsHelper, importItem, importItemsHelper } from '../backend/suppliers';
import Layout from './Layout';
import { PageType, Supplier } from '../types';
import { useNavigate } from 'react-router-dom';

export default function SuppliersPage() {
    const { db } = useAuth();
    const [first, setFirst] = useState(true);
    const [suppliers, setSuppliers] = useState<Map<string, Supplier>>();
    const navigate = useNavigate();
    
    const addSupplier = async (supplierName: string, number: string) => {
        try {
            const key = await createSupplier(db!, supplierName, number);
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
                } else if (error.code === FIREBASE_NAME_EXISTS_ERROR) {
                    // JOE: 
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
                console.log("Suppliers");
                console.log(suppliers);
                setSuppliers(suppliers)
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

    const getSupplierDetails = async (supplierUuid: string) => {
        try {
            const supplier = await getSupplier(db!, supplierUuid);
            if (supplier) {
                console.log("supplier");
                console.log(supplier);
                // JOE: SET THE Client
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

    const importItems = async (supplierUuid: string, moneyPaid: number, items: importItem[]) => {
        try {
            const receiptUuid = await importItemsHelper(db!, supplierUuid, moneyPaid, items);
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
                }  else if (error.code === FIREBASE_NOTFOUND_ERROR) {
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
                // JOE: SET THE receipts
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
                }  else if (error.code === FIREBASE_NOTFOUND_ERROR) {
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
        // addSupplier("Omar", "01021853989");
        getSuppliers()
        // getSupplierDetails("azQugowBzv9m2ncXcjSSz");
        if(first) {
            setFirst(false);
            // getSupplierReceipts("RMAvvJC7pnyvEpg1jyPW");
            // importItems("RMAvvJC7pnyvEpg1jyPW", 50, [
            //     {
            //         productUuid: "ObqGXhTQ9qzLpR3Ksx4v",
            //         mass: 5,
            //         boxes: 1,
            //         price: 10
            //     }
            // ]);
        }
    }, []);

    return (
        <Layout page={PageType.SUPPLIERS}>
            <div className='top'>
                <h2 className='title'>Suppliers</h2>
                <button className='add'>
                    <span>Add New</span>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g id="Edit / Add_Plus">
                            <path id="Vector" d="M6 12H12M12 12H18M12 12V18M12 12V6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
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
                    suppliers ?
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>Number</th>
                                <th>Balance</th>
                            </tr>
                            {
                                [...suppliers.entries()].map(([id, supplier]) => {
                                    return <tr onClick={() => navigate(`/suppliers/${id}`)}>
                                        <td>{supplier.username}</td>
                                        <td>{supplier.number}</td>
                                        <td>{supplier.balance}</td>
                                    </tr>
                                })
                            }
                        </table> :
                        <div>
                            There is no suppliers yet, add a client to interact with him
                        </div>
                }
            </div>
        </Layout>
    )
}
