import { addDoc, collection, doc, endAt, Firestore, getDoc, getDocs, orderBy, query, startAt, Timestamp, where } from "firebase/firestore";
import { getSupplier, updateBalance } from "./suppliers";
import { updateAdminBalance } from "./admin";
import { ExtendedVaultRec, VaultRec, VaultRecType } from "../utils/types";
import { FIREBASE_ERROR, FIREBASE_NOTFOUND_ERROR } from "../config/Constants";
import { FirebaseError } from "../errors/FirebaseError";
import { getClient, updateBalance as updateClientBalance } from "./clients";


export const getVaultRecsHelper = async (database: Firestore, startDate?: Date, endDate?: Date): Promise<Map<string, ExtendedVaultRec>> => {
    try {
        const receiptsRef = collection(database, "vault");
        let q;
        if (startDate && endDate)
            q = query(receiptsRef, orderBy('createdAt', 'desc'), startAt(endDate), endAt(startDate));
        else
            q = query(receiptsRef, orderBy('createdAt', 'desc'))
        
        const querySnapshot = await getDocs(q);
        const vaultRecs: Map<string, ExtendedVaultRec> = new Map();
        await Promise.all(querySnapshot.docs.map(async item => {
            const { amount, createdAt, userUuid, type } = item.data();
            let userName = "";
            if (type == VaultRecType.OUT) {
                userName= (await getSupplier(database, userUuid)).username;
            } else if (type == VaultRecType.IN) {
                userName= (await getClient(database, userUuid)).username;
            }
            vaultRecs.set(item.id, {
                amount, createdAt,
                userUuid,
                type,
                userName
            });
        }));
        return vaultRecs;
    } catch (e) {
        console.log("Error adding item", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getVaultRec = async (database: Firestore, recUuid: string): Promise<VaultRec> => {
    try {
        const docRef = doc(database, "vault", recUuid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { userUuid, amount, type, createdAt } = docSnap.data();
            return {
                userUuid, amount, type, createdAt
            };
        } else {
            throw new FirebaseError(FIREBASE_NOTFOUND_ERROR);
        }
        
    } catch (e) {
        console.log("Error adding item", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const createVaultRec = async (database: Firestore, type: VaultRecType, userUuid: string, amount: number): Promise<string> => {
    try {
        const docRef = await addDoc(collection(database, 'vault'), {
            userUuid,
            amount,
            type,
            createdAt: Timestamp.now()
        });

        if (docRef.id) {
            return docRef.id;
        } else {
            throw new FirebaseError(FIREBASE_ERROR);
        }
    } catch (e) {
        console.log("Error adding item", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const payHelper = async (database: Firestore, supplierUuid: string, amount: number): Promise<string> => {
    try {
        await getSupplier(database, supplierUuid);

        await updateBalance(database, supplierUuid, amount);
        await updateAdminBalance(database, -amount);

        const vaultRecUuid = await createVaultRec(database, VaultRecType.OUT, supplierUuid, amount);
        return vaultRecUuid;
    } catch (e) {
        console.log("Error importing items", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getPaidHelper = async (database: Firestore, clientUuid: string, amount: number): Promise<string> => {
    try {
        await getClient(database, clientUuid);

        await updateClientBalance(database, clientUuid, -amount);
        await updateAdminBalance(database, amount);

        const vaultRecUuid = await createVaultRec(database, VaultRecType.IN, clientUuid, amount);
        return vaultRecUuid;
    } catch (e) {
        console.log("Error importing items", e);
        if (e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}