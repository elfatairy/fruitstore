import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore";
// import { attemptFirebasePush } from "./firebase";
import { FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOTFOUND_ERROR } from "../config/Constants";
import { FirebaseError } from "../errors/FirebaseError";
import { Item, Product } from "../types";
import { getSupplier } from "./suppliers";

export const getAllProducts = async (database: Firestore): Promise<Map<string, Product>> => {
    try {
        const querySnapshot = await getDocs(collection(database, "products"));
        const products = new Map();
        const productsIds: string[] = [];

        querySnapshot.forEach((doc) => {
            productsIds.push(doc.id);
        });

        
        await Promise.all(productsIds.map(async (id) => {
            const product = await getProduct(database, id);
            products.set(id, product);
        }));

        return products;
    } catch (e) {
        console.log("Error getting all products", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getProduct = async (database: Firestore, productUuid: string): Promise<Product> => {
    try {
        const docRef = doc(database, "products", productUuid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const {name, createdAt, updatedAt} = docSnap.data();
            const itemsRef = collection(database, "items");
            const q = query(itemsRef, where("productUuid", "==", productUuid));
            const querySnapshot = await getDocs(q);
            const items: Map<string, Item> = new Map();
            querySnapshot.forEach((itemDoc) => {
                const {productUuid, supplierUuid, receiptItemUuid, mass, boxes, createdAt, updatedAt} = itemDoc.data();
                items.set(itemDoc.id, {
                    productUuid, supplierUuid, receiptItemUuid, mass, boxes, createdAt, updatedAt
                });
            })
            for(const [Uid, item] of items) {
                const { username: supplierName } = await getSupplier(database, item.supplierUuid);
                items.set(Uid, {...item, supplierName})
            }
            return {
                name, createdAt, updatedAt, items
            };
        } else {
            throw new FirebaseError(FIREBASE_NOTFOUND_ERROR);
        }
    } catch (e) {
        console.log("Error getting a product", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const createProduct = async (database: Firestore, name: string): Promise<string> => {
    try {
        const productsRef = collection(database, "products");
        const q = query(productsRef, where("name", "==", name));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length != 0) {
            throw new FirebaseError(FIREBASE_NAME_EXISTS_ERROR);
        }

        const docRef = await addDoc(collection(database, 'products'), {
            name,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });

        if (docRef.id) {
            return docRef.id;
        } else {
            throw new FirebaseError(FIREBASE_ERROR);
        }
    } catch (e) {
        console.log("Error creating a product", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}