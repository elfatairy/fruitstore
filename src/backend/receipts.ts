import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore";
// import { attemptFirebasePush } from "./firebase";
import { FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOTFOUND_ERROR } from "../config/Constants";
import { FirebaseError } from "../errors/FirebaseError";
import { ClientItem, FullReceipt, Item, Product, Receipt, ReceiptType, VaultRec } from "../utils/types";
import { getSupplier } from "./suppliers";
import { getClient } from "./clients";
import { getClientItem, getItem } from "./items";
import { getVaultRec } from "./vault";

export const getAllReceipts = async (database: Firestore): Promise<Map<string, Receipt>> => {
    try {
        const querySnapshot = await getDocs(collection(database, "receipts"));
        const receipts = new Map();

        querySnapshot.forEach((doc) => {
            receipts.set(doc.id, doc.data());
        });

        return receipts;
    } catch (e) {
        console.log("Error getting all receipts", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getReceipt = async (database: Firestore, receiptUuid: string): Promise<FullReceipt> => {
    try {
        const docRef = doc(database, "receipts", receiptUuid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { type, userUuid, balanceBefore, totalPrice, moneyPaid, itemsObject, vaultRecsObject, createdAt, updatedAt } = docSnap.data();
            let userName = "";
            const items: Item[] = [];
            const clientItems: ClientItem[] = [];

            if (type == ReceiptType.IMPORT) {
                userName = (await getSupplier(database, userUuid)).username;
                await Promise.all(Object.entries(itemsObject).map(async ([itemUuid, _]) => {
                    items.push(await getItem(database, itemUuid));
                }))
            } else if (type == ReceiptType.EXPORT) {
                userName = (await getClient(database, userUuid)).username;
                await Promise.all(Object.entries(itemsObject).map(async ([itemUuid, _]) => {
                    clientItems.push(await getClientItem(database, itemUuid));
                }));
            }

            const vaultRecs: VaultRec[] = [];
            await Promise.all(Object.entries(vaultRecsObject).map(async ([recUuid, _]) => {
                vaultRecs.push(await getVaultRec(database, recUuid));
            }));

            if (type == ReceiptType.IMPORT) {
                return {
                    type, userUuid, userName, balanceBefore, totalPrice, moneyPaid, items, vaultRecs, createdAt, updatedAt, itemsObject, vaultRecsObject
                };
            } else if (type == ReceiptType.EXPORT) {
                return {
                    type, userUuid, userName, balanceBefore, totalPrice, moneyPaid, items: clientItems, vaultRecs, createdAt, updatedAt, itemsObject, vaultRecsObject
                };
            }

            throw new Error("Not valid receipt type");

        } else {
            throw new FirebaseError(FIREBASE_NOTFOUND_ERROR);
        }
    } catch (e) {
        console.log("Error getting a receipt", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const createReceipt = async (database: Firestore,
    type: ReceiptType,
    userUuid: string,
    totalPrice: number,
    moneyPaid: number,
    items: string[],
    vaultRecs: string[]
): Promise<string> => {
    try {
        let balanceBefore = 0;
        if (type === ReceiptType.IMPORT) {
            balanceBefore = (await getSupplier(database, userUuid)).balance;
        } else if (type == ReceiptType.EXPORT) {
            balanceBefore = (await getClient(database, userUuid)).balance;
        }

        let itemsObject: Record<string, boolean> = {};
        items.forEach(item => {
            itemsObject[item] = true;
        });

        let vaultRecsObject: Record<string, boolean> = {};
        vaultRecs.forEach(rec => {
            vaultRecsObject[rec] = true;
        });

        const docRef = await addDoc(collection(database, 'receipts'), {
            type,
            userUuid,
            balanceBefore,
            totalPrice,
            moneyPaid,
            itemsObject,
            vaultRecsObject,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });

        if (docRef.id) {
            return docRef.id;
        } else {
            throw new FirebaseError(FIREBASE_ERROR);
        }
    } catch (e) {
        console.log("Error adding a receipt", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}