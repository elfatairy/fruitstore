import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore";
// import { attemptFirebasePush } from "./firebase";
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, REQUEST_LIMIT } from "../config/Constants";
import { FirebaseError } from "../errors/FirebaseError";
import { Client, Supplier } from "../types";

export const getAllSuppliers = async (database: Firestore): Promise<Map<string, Supplier>> => {
    try {
        const querySnapshot = await getDocs(collection(database, "suppliers"));
        const suppliers = new Map();

        querySnapshot.forEach((doc) => {
            suppliers.set(doc.id, doc.data());
        });

        return suppliers;
    } catch (e) {
        console.log("Error getting all suppliers", e);
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getSupplier = async (database: Firestore, supplierUuid: string): Promise<Supplier> => {
    try {
        const docRef = doc(database, "suppliers", supplierUuid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const {username, number, balance, createdAt, updatedAt} = docSnap.data();
            return {
                username, number, balance, createdAt, updatedAt
            };
        } else {
            throw new FirebaseError(FIREBASE_ERROR);
        }
    } catch (e) {
        console.log("Error getting a supplier", e);
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const createSupplier = async (database: Firestore, username: string, number: string): Promise<string> => {
    try {
        const citiesRef = collection(database, "suppliers");
        const q = query(citiesRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length != 0) {
            throw new FirebaseError(FIREBASE_NAME_EXISTS_ERROR);
        }

        const docRef = await addDoc(collection(database, 'suppliers'), {
            username,
            number,
            balance: 0,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });

        if (docRef.id) {
            return docRef.id;
        } else {
            throw new FirebaseError(FIREBASE_ERROR);
        }
    } catch (e) {
        console.log("Error adding item", e);
        throw new FirebaseError(FIREBASE_ERROR);
    }
}