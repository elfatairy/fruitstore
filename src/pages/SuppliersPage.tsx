import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { createSupplier, getAllSuppliers, getSupplier } from '../backend/suppliers';

export default function SuppliersPage() {
    const { db } = useAuth();

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
                } else if (error.code === FIREBASE_CREATING_ERROR) {
                    // JOE: ERROR CREATING THE INSTANCE
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
        // JOE: This function will be used in the website too
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
                } else if (error.code === FIREBASE_NAME_EXISTS_ERROR) {
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
        getSupplierDetails("azQugowBzv9m2ncXcjSSz");
    }, []);

    return (
        <div>ClientsPage</div>
    )
}
