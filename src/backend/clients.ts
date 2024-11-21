import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
// import { attemptFirebasePush } from "./firebase";
import { FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOTFOUND_ERROR } from "../config/Constants";
import { FirebaseError } from "../errors/FirebaseError";
import { Client, ExtendedClientItem, Receipt, ReceiptType, VaultRec } from "../utils/types";
import { getProduct } from "./products";
import { decreaseItem, getClientItem, getItem } from "./items";
import { getSupplier } from "./suppliers";
import { getVaultRec } from "./vault";
import { createReceipt } from "./receipts";

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
        if (e instanceof FirebaseError) {
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
            const { username, number, balance, createdAt, updatedAt } = docSnap.data();
            return {
                username, number, balance, createdAt, updatedAt
            };
        } else {
            throw new FirebaseError(FIREBASE_NOTFOUND_ERROR);
        }
    } catch (e) {
        console.log("Error getting a client", e);
        if (e instanceof FirebaseError) {
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
        if (e instanceof FirebaseError) {
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
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export type exportItemType = {
    itemUuid: string,
    mass: number,
    boxes: number,
    price: number
}
export const exportItemHelper = async (database: Firestore, clientUuid: string, item: exportItemType): Promise<string> => {
    try {
        await getClient(database, clientUuid);
        await getItem(database, item.itemUuid);

        const { itemUuid, mass, boxes, price } = item;
        const docRef = await addDoc(collection(database, 'clientItems'), {
            clientUuid,
            itemUuid,
            mass,
            boxes,
            price,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });

        if (docRef.id) {
            await decreaseItem(database, itemUuid, mass, boxes);
        } else {
            throw new FirebaseError(FIREBASE_ERROR);
        }

        // await updateBalance(database, clientUuid, moneyPaid - totalPrice);
        // await updateAdminBalance(database, moneyPaid);

        return docRef.id;
    } catch (e) {
        console.log("Error exporting items", e);
        if (e instanceof FirebaseError) {
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
            const { type, userUuid, balanceBefore, totalPrice, moneyPaid, createdAt, updatedAt, itemsObject, vaultRecsObject } = receipt.data();
            receipts.set(receipt.id, {
                type, userUuid, balanceBefore, totalPrice, moneyPaid, createdAt, updatedAt, itemsObject, vaultRecsObject
            });
        });
        return receipts;
    } catch (e) {
        console.log("Error getting client receipts", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getClientItemsHelper = async (database: Firestore, clientUuid: string): Promise<Map<string, ExtendedClientItem>> => {
    try {
        await getClient(database, clientUuid);

        const receiptsRef = collection(database, "clientItems");
        const q = query(receiptsRef, where("clientUuid", "==", clientUuid));
        const querySnapshot = await getDocs(q);
        const items: Map<string, ExtendedClientItem> = new Map();

        await Promise.all(querySnapshot.docs.map(async item => {
            const { mass, price, boxes, receiptItemUuid, createdAt, updatedAt, itemUuid, clientUuid } = item.data();
            const { createdAt: importDate, supplierUuid, productUuid } = await getItem(database, itemUuid);
            const { name: productName } = await getProduct(database, productUuid);
            const { username: supplierName } = await getSupplier(database, supplierUuid);
            items.set(item.id, {
                mass, price, boxes, receiptItemUuid, productName, createdAt, updatedAt, supplierUuid, importDate, itemUuid, clientUuid, supplierName
            });
        }));
        return items;
    } catch (e) {
        console.log("Error getting supplier receipts", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getClientVaultRecsHelper = async (database: Firestore, clientUuid: string): Promise<Map<string, Partial<VaultRec>>> => {
    try {
        await getClient(database, clientUuid);

        const receiptsRef = collection(database, "vault");
        const q = query(receiptsRef, where("userUuid", "==", clientUuid));
        const querySnapshot = await getDocs(q);
        const vaultRecs: Map<string, Partial<VaultRec>> = new Map();
        await Promise.all(querySnapshot.docs.map(async item => {
            const { amount, createdAt } = item.data();
            vaultRecs.set(item.id, {
                amount, createdAt
            });
        }));
        return vaultRecs;
    } catch (e) {
        console.log("Error getting supplier receipts", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const createClientReceipt = async (database: Firestore, clientUuid: string, clientItems: string[], vaultRecs: string[]): Promise<string> => {
    try {
        await getClient(database, clientUuid);

        let totalPrice = 0;
        await Promise.all(clientItems.map(async (itemUuid) => {
            const item = await getClientItem(database, itemUuid);
            totalPrice += item.price * item.mass;
        }));

        let totalMoney = 0;
        await Promise.all(vaultRecs.map(async (recUuid) => {
            const rec = await getVaultRec(database, recUuid);
            totalMoney += rec.amount;
        }));

        const receiptUuid = await createReceipt(database, ReceiptType.EXPORT, clientUuid, totalPrice, totalMoney, clientItems, vaultRecs);

        return receiptUuid;
    } catch (e) {
        console.log("Error importing items", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}