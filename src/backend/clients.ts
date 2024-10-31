import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
// import { attemptFirebasePush } from "./firebase";
import { FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOTFOUND_ERROR } from "../config/Constants";
import { FirebaseError } from "../errors/FirebaseError";
import { Client, Receipt, ReceiptType } from "../types";
import { getProduct } from "./products";
import { createReceipt, createReceiptItem } from "./receipts";
import { createItem, decreaseItem, getItem } from "./items";
import { updateAdminBalance } from "./admin";

export const getAllClients = async (database: Firestore): Promise<Map<string, Client>> => {
    try {
        const querySnapshot = await getDocs(collection(database, "clients"));
        const clients = new Map();

        querySnapshot.forEach((doc) => {
            clients.set(doc.id, doc.data());
        });

        return clients;
    } catch (e) {
        console.log("Error getting all clients", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getClient = async (database: Firestore, clientUuid: string): Promise<Client> => {
    try {
        const docRef = doc(database, "clients", clientUuid);
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
        console.log("Error getting a client", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const createClient = async (database: Firestore, username: string, number: string): Promise<string> => {
    try {
        const citiesRef = collection(database, "clients");
        const q = query(citiesRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length != 0) {           
            throw new FirebaseError(FIREBASE_NAME_EXISTS_ERROR);
        }

        const docRef = await addDoc(collection(database, 'clients'), {
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
        console.log("Error adding client", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const updateBalance = async (database: Firestore, clientUuid: string, amount: number): Promise<number> => {
    try {
        const clientRef = doc(database, "clients", clientUuid);
        const newBalance = (await getDoc(clientRef)).data()!.balance + amount;
        updateDoc(clientRef, {
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

export type exportItem = {
    itemUuid: string, 
    mass: number, 
    boxes: number,
    price: number
}
export const exportItemsHelper = async (database: Firestore, clientUuid: string, moneyPaid: number, items: exportItem[]): Promise<string> => {
    try {
        await getClient(database, clientUuid);
        let totalPrice: number = 0;
        await Promise.all(items.map(async (item) => {
            await getItem(database, item.itemUuid);
            totalPrice += item.price * item.mass;
        }));
        
        const receiptUuid = await createReceipt(database, ReceiptType.EXPORT, clientUuid, totalPrice, moneyPaid);

        await Promise.all(items.map(async (item) => {
            await decreaseItem(database, item.itemUuid, item.mass, item.boxes);
            await createReceiptItem(database, receiptUuid, item.itemUuid, item.mass, item.boxes, item.price);
        }));

        await updateBalance(database, clientUuid, moneyPaid - totalPrice);
        await updateAdminBalance(database, moneyPaid);

        return receiptUuid;
    } catch (e) {
        console.log("Error exporting items", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getClientReceiptsHelper = async (database: Firestore, clientUuid: string): Promise<Map<string, Receipt>> => {
    try {
        await getClient(database, clientUuid);
        
        const receiptsRef = collection(database, "receipts");
        const q = query(receiptsRef, where("userUuid", "==", clientUuid));
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
        console.log("Error getting client receipts", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}