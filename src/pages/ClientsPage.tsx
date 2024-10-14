import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { createClient, getAllClients, getClient } from '../backend/clients';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';

export default function ClientsPage() {
    const { db } = useAuth();

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

    const getClients = async () => {
        try {
            const clients = await getAllClients(db!);
            if (clients) {
                console.log("clients");
                console.log(clients);
                // JOE: SET THE Clients
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

    const getClientDetails = async (clientUuid: string) => {
        // JOE: This function will be used in the website too
        try {
            const client = await getClient(db!, clientUuid);
            if (client) {
                console.log("client");
                console.log(client);
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
                }  else if (error.code === FIREBASE_NAME_EXISTS_ERROR) {
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
        // getClients();
        getClientDetails("t3Djn4ODbjMoBEzfwTz7");
    }, []);

    return (
        <div>ClientsPage</div>
    )
}
