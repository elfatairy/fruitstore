import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore";
// import { attemptFirebasePush } from "./firebase";
import { FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOTFOUND_ERROR } from "../config/Constants";
import { FirebaseError } from "../errors/FirebaseError";
import { FullReceipt, FullReceiptItem, Item, Product, Receipt, ReceiptType } from "../types";
import { getSupplier } from "./suppliers";
import { getClient } from "./clients";

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
        if(e instanceof FirebaseError) {
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
            const {type, userUuid, balanceBefore, totalPrice, moneyPaid, createdAt, updatedAt} = docSnap.data();
            let userName = "";
            if(type == ReceiptType.IMPORT) {
                userName = (await getSupplier(database, userUuid)).username;
            } else if (type == ReceiptType.EXPORT) {
                userName = (await getClient(database, userUuid)).username;
            }
            const items: FullReceiptItem[] = [];
            const receiptsItemsRef = collection(database, "receiptsItems");
            const q = query(receiptsItemsRef, where("receiptUuid", "==", receiptUuid));
            const querySnapshot = await getDocs(q);
            querySnapshot.docs.forEach(async (receiptItemDoc) => {
                const {itemUuid, mass, boxes, price} = receiptItemDoc.data();
                const item = await getDoc(doc(database, "items", itemUuid));
                if(!item.exists()) {
                    throw new FirebaseError(FIREBASE_ERROR);
                }
                const {supplierUuid, productUuid} = item.data();
                const supplier = await getDoc(doc(database, "suppliers", supplierUuid));
                if(!supplier.exists()) {
                    throw new FirebaseError(FIREBASE_ERROR);
                }
                const {username: supplierName} = supplier.data();
                const product = await getDoc(doc(database, "products", productUuid));
                if(!product.exists()) {
                    throw new FirebaseError(FIREBASE_ERROR);
                }
                const {name: productName} = product.data();
                items.push({itemUuid, supplierUuid, supplierName, productName, mass, boxes, price
                })
            });
            return {
                type, userUuid, userName, balanceBefore, totalPrice, moneyPaid, items, createdAt, updatedAt
            };
        } else {
            throw new FirebaseError(FIREBASE_NOTFOUND_ERROR);
        }
    } catch (e) {
        console.log("Error getting a receipt", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const createReceipt = async (database: Firestore, 
    type: ReceiptType,
    userUuid: string,
    totalPrice: number,
    moneyPaid: number
): Promise<string> => {
    try {
        let balanceBefore = 0;
        if(type === ReceiptType.IMPORT) {
            balanceBefore = (await getSupplier(database, userUuid)).balance;
        } else if (type == ReceiptType.EXPORT) {
            balanceBefore = (await getClient(database, userUuid)).balance;
        }

        const docRef = await addDoc(collection(database, 'receipts'), {
            type,
            userUuid,
            balanceBefore,
            totalPrice,
            moneyPaid,
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
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const createReceiptItem = async (database: Firestore, 
    receiptUuid: string,
    itemUuid: string, 
    mass: number, 
    boxes: number,
    price: number,
): Promise<string> => {
    try {
        const docRef = await addDoc(collection(database, 'receiptsItems'), {
            receiptUuid,
            itemUuid,
            mass,
            boxes,
            price
        });

        if (docRef.id) {
            return docRef.id;
        } else {
            throw new FirebaseError(FIREBASE_ERROR);
        }
    } catch (e) {
        console.log("Error creating receipt items", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}