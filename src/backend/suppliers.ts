import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
// import { attemptFirebasePush } from "./firebase";
import { FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOTFOUND_ERROR } from "../config/Constants";
import { FirebaseError } from "../errors/FirebaseError";
import { Receipt, ReceiptType, Supplier } from "../types";
import { getProduct } from "./products";
import { createItem } from "./items";
import { createReceipt, createReceiptItem } from "./receipts";

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
        if(e instanceof FirebaseError) {
            throw e
        }
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
            throw new FirebaseError(FIREBASE_NOTFOUND_ERROR);
        }
    } catch (e) {
        console.log("Error getting a supplier", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const createSupplier = async (database: Firestore, username: string, number: string): Promise<string> => {
    try {
        const suppliersRef = collection(database, "suppliers");
        const q = query(suppliersRef, where("username", "==", username));
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
        console.log("Error adding supplier", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const updateBalance = async (database: Firestore, supplierUuid: string, amount: number): Promise<number> => {
    try {
        const supplierRef = doc(database, "suppliers", supplierUuid);
        const newBalance = (await getDoc(supplierRef)).data()!.balance + amount;
        updateDoc(supplierRef, {
            balance: newBalance,
            updatedAt: Timestamp.now() 
        });

        return newBalance;
    } catch (e) {
        console.log("Error updating balance", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export type importItem = {
    productUuid: string, 
    mass: number, 
    boxes: number,
    price: number
}
export const importItemsHelper = async (database: Firestore, supplierUuid: string, moneyPaid: number, items: importItem[]): Promise<string> => {
    try {
        await getSupplier(database, supplierUuid);
        let totalPrice: number = 0;
        items.forEach(async (item) => {
            await getProduct(database, item.productUuid);
            totalPrice += item.price * item.mass;
        });
        
        const receiptUuid = await createReceipt(database, ReceiptType.IMPORT, supplierUuid, totalPrice, moneyPaid);

        items.forEach(async (item) => {
            const itemUuid = await createItem(database, item.productUuid, supplierUuid, receiptUuid, item.mass, item.boxes);
            await createReceiptItem(database, receiptUuid, itemUuid, item.mass, item.boxes, item.price);
        });

        await updateBalance(database, supplierUuid, totalPrice - moneyPaid);
        // Omar: Update admin balance

        return receiptUuid;
    } catch (e) {
        console.log("Error importing items", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getSupplierReceiptsHelper = async (database: Firestore, supplierUuid: string): Promise<Map<string, Receipt>> => {
    try {
        await getSupplier(database, supplierUuid);
        
        const receiptsRef = collection(database, "receipts");
        const q = query(receiptsRef, where("userUuid", "==", supplierUuid));
        const querySnapshot = await getDocs(q);
        const receipts: Map<string, Receipt> = new Map();
        querySnapshot.docs.forEach(receipt => {
            const {type, userUuid, balanceBefore, totalPrice, moneyPaid, createdAt, updatedAt} = receipt.data();
            receipts.set(receipt.id, {
                type, userUuid, balanceBefore, totalPrice, moneyPaid, createdAt, updatedAt
            });
        });
        return receipts;
    } catch (e) {
        console.log("Error getting supplier receipts", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}