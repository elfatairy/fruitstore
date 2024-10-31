import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { createProduct, getAllProducts, getProduct } from '../backend/products';
import { getAllItems, getItem } from '../backend/items';

export default function ItemPage() {
    const { db } = useAuth();

    const getItems = async () => {
        try {
            const items = await getAllItems(db!);
            if (items) {
                console.log("items");
                console.log(items);
                // JOE: SET THE items
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

    const getItemDetails = async (itemUuid: string) => {
        try {
            const item = await getItem(db!, itemUuid);
            if (item) {
                console.log("item");
                console.log(item);
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
        // getItems();
        getItemDetails("K0SpW6akjqgEpnwsQlla"); 
    }, []);

    return (
        <div>ItemsPage</div>
    )
}
