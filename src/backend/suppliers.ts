import { addDoc, collection, doc, endAt, Firestore, getDoc, getDocs, orderBy, query, startAt, Timestamp, updateDoc, where } from "firebase/firestore";
// import { attemptFirebasePush } from "./firebase";
import { FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOTFOUND_ERROR } from "../config/Constants";
import { FirebaseError } from "../errors/FirebaseError";
import { ExtendedItem, Item, Receipt, ReceiptType, Supplier, VaultRec } from "../utils/types";
import { getProduct } from "./products";
import { createItem, getItem } from "./items";
import { createReceipt } from "./receipts";
import { updateAdminBalance } from "./admin";
import { getVaultRec } from "./vault";

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
        if (e instanceof FirebaseError) {
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
            const { username, number, balance, createdAt, updatedAt } = docSnap.data();
            return {
                username, number, balance, createdAt, updatedAt
            };
        } else {
            throw new FirebaseError(FIREBASE_NOTFOUND_ERROR);
        }
    } catch (e) {
        console.log("Error getting a supplier", e);
        if (e instanceof FirebaseError) {
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
        if (e instanceof FirebaseError) {
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
        if (e instanceof FirebaseError) {
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

export const importItemHelper = async (database: Firestore, supplierUuid: string, item: importItem) => {
    try {
        await getSupplier(database, supplierUuid);
        await getProduct(database, item.productUuid);

        const itemUuid = createItem(database, item.productUuid, supplierUuid, "", item.mass, item.boxes, item.price);
        return itemUuid;
    } catch (e) {
        console.log("Error importing items", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const createSupplierReceipt = async (database: Firestore, supplierUuid: string, items: string[], vaultRecs: string[]) : Promise<string> => {
    try {
        await getSupplier(database, supplierUuid);

        let totalPrice = 0;
        await Promise.all(items.map(async (itemUuid) => {
            const item = await getItem(database, itemUuid);
            totalPrice += item.price * item.mass;
        }));
        
        let totalMoney = 0;
        await Promise.all(vaultRecs.map(async (recUuid) => {
            const rec = await getVaultRec(database, recUuid);
            totalMoney += rec.amount;
        }));
        
        const receiptUuid = await createReceipt(database, ReceiptType.IMPORT, supplierUuid, totalPrice, totalMoney, items, vaultRecs);

        return receiptUuid;
    } catch (e) {
        console.log("Error importing items", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getSupplierReceiptsHelper = async (database: Firestore, supplierUuid: string, startDate?: Date, endDate?: Date): Promise<Map<string, Receipt>> => {
    try {
        await getSupplier(database, supplierUuid);

        const receiptsRef = collection(database, "receipts");
        let q;
        if (startDate && endDate)
            q = query(receiptsRef, where("userUuid", "==", supplierUuid), orderBy('createdAt', 'desc'), startAt(endDate), endAt(startDate));
        else
            q = query(receiptsRef, where("userUuid", "==", supplierUuid), orderBy('createdAt', 'desc'))
        
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
        console.log("Error getting supplier receipts", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}


export const getSupplierItemsHelper = async (database: Firestore, supplierUuid: string, startDate?: Date, endDate?: Date): Promise<Map<string, ExtendedItem>> => {
    try {
        await getSupplier(database, supplierUuid);

        const receiptsRef = collection(database, "items");
        let q;
        if (startDate && endDate)
            q = query(receiptsRef, where("supplierUuid", "==", supplierUuid), orderBy('createdAt', 'desc'), startAt(endDate), endAt(startDate));
        else
            q = query(receiptsRef, where("supplierUuid", "==", supplierUuid), orderBy('createdAt', 'desc'))
        
        const querySnapshot = await getDocs(q);
        const items: Map<string, ExtendedItem> = new Map();
        await Promise.all(querySnapshot.docs.map(async item => {
            const { mass, price, boxes, productUuid, receiptItemUuid, createdAt, updatedAt } = item.data();
            const { name: productName } = await getProduct(database, productUuid);
            items.set(item.id, {
                mass, price, boxes, receiptItemUuid, productName, createdAt, updatedAt, productUuid, supplierUuid
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

export const getSupplierVaultRecsHelper = async (database: Firestore, supplierUuid: string, startDate?: Date, endDate?: Date): Promise<Map<string, Partial<VaultRec>>> => {
    try {
        await getSupplier(database, supplierUuid);

        const receiptsRef = collection(database, "vault");
        let q;
        if (startDate && endDate)
            q = query(receiptsRef, where("userUuid", "==", supplierUuid), orderBy('createdAt', 'desc'), startAt(endDate), endAt(startDate));
        else
            q = query(receiptsRef, where("userUuid", "==", supplierUuid), orderBy('createdAt', 'desc'))

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