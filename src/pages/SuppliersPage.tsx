import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOT_ENOUGH_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { createSupplier, getAllSuppliers, getSupplier, getSupplierReceiptsHelper, importItem, importItemsHelper } from '../backend/suppliers';

export default function SuppliersPage() {
    const { db } = useAuth();
    const [first, setFirst] = useState(true);

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
                // JOE: SET THE suppliers
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

    const getSupplierDetails = async (clientUuid: string) => {
        try {
            const supplier = await getSupplier(db!, clientUuid);
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
    
    const getSupplierReceipts = async (clientUuid: string) => {
        try {
            const receipts = await getSupplierReceiptsHelper(db!, clientUuid);
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
        // getSuppliers()
        // getSupplierDetails("azQugowBzv9m2ncXcjSSz");
        if(first) {
            setFirst(false);
            getSupplierReceipts("RMAvvJC7pnyvEpg1jyPW");
            // importItems("RMAvvJC7pnyvEpg1jyPW", 300, [
            //     {
            //         productUuid: "ObqGXhTQ9qzLpR3Ksx4v",
            //         mass: 5,
            //         boxes: 1,
            //         price: 10
            //     },
            //     {
            //         productUuid: "inoW652XJvQBlXnOh7j5",
            //         mass: 10,
            //         boxes: 2,
            //         price: 30
            //     }
            // ]);
        }
    }, []);

    return (
        <div>SuppliersPage</div>
    )
}
