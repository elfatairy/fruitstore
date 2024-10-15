import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
// import { attemptFirebasePush } from "./firebase";
import { FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOT_ENOUGH_ERROR, FIREBASE_NOTFOUND_ERROR } from "../config/Constants";
import { FirebaseError } from "../errors/FirebaseError";
import { Item, Product } from "../types";

export const getAllItems = async (database: Firestore): Promise<Map<string, Item>> => {
    try {
        const querySnapshot = await getDocs(collection(database, "items"));
        const items = new Map();

        querySnapshot.forEach((doc) => {
            items.set(doc.id, doc.data());
        });

        return items;
    } catch (e) {
        console.log("Error getting all items", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getItem = async (database: Firestore, itemUuid: string): Promise<Item> => {
    try {
        const docRef = doc(database, "items", itemUuid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const {productUuid, supplierUuid, receiptItemUuid, mass, boxes, createdAt, updatedAt} = docSnap.data();
            return {
                productUuid, supplierUuid, receiptItemUuid, mass, boxes, createdAt, updatedAt
            };
        } else {
            throw new FirebaseError(FIREBASE_NOTFOUND_ERROR);
        }
    } catch (e) {
        console.log("Error getting an item", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const createItem = async (database: Firestore, 
    productUuid: string, 
    supplierUuid: string, 
    receiptItemUuid: string,
    mass: number, 
    boxes: number
): Promise<string> => {
    try {

        const docRef = await addDoc(collection(database, 'items'), {
            receiptItemUuid,
            productUuid,
            supplierUuid,
            mass,
            boxes,
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
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const decreaseItem = async (database: Firestore, 
    itemUuid: string, 
    decreasedMass: number, 
    decreasedBoxes: number
): Promise<Boolean> => {
    try {
        const item = await getItem(database, itemUuid);
        const itemRef = doc(database, "items", itemUuid);
        if(decreasedMass > item.mass || decreasedBoxes > item.boxes) {
            throw new FirebaseError(FIREBASE_NOT_ENOUGH_ERROR);
        }
        await updateDoc(itemRef, {
            mass: item.mass - decreasedMass,
            boxes: item.boxes - decreasedBoxes
        });
        return true;
    } catch (e) {
        console.log("Error decreasing items", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}