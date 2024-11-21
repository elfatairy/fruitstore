import { collection, doc, Firestore, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { FirebaseError } from "../errors/FirebaseError";
import { FIREBASE_ERROR } from "../config/Constants";
import { AnalysisPeriods, ReceiptType } from "../utils/types";

export const updateAdminBalance = async (database: Firestore, amount: number): Promise<number> => {
    try {
        const balanceRef = doc(database, "general", "balance");
        const newBalance = (await getDoc(balanceRef)).data()!.current + amount;
        updateDoc(balanceRef, {
            current: newBalance,
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

const intervalToDate = (interval: AnalysisPeriods): Date => {
    let startTime;
    const now = new Date();
    switch(interval) {
        case AnalysisPeriods.DAY:
            startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case AnalysisPeriods.WEEK:
            startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 1) % 7));
            break;
        case AnalysisPeriods.MONTH:
            startTime = new Date(now.getFullYear(), now.getMonth());
            break;
        case AnalysisPeriods.YEAR:
            startTime = new Date(now.getFullYear(), 0);
            break;
        case AnalysisPeriods.ALL:
        default:
            startTime = new Date(0);
            break;
    }
    return startTime;
}

export const getReceiptsAnalysisHelper = async (database: Firestore, interval: AnalysisPeriods): Promise<number> => {
    try {
        const receiptsRef = collection(database, "receipts");
        
        const q = query(receiptsRef, where("createdAt", ">=", intervalToDate(interval)));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.length;
    } catch (e) {
        console.log("Error getting receipts analysis", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getSellingAnalysisHelper = async (database: Firestore, interval: AnalysisPeriods): Promise<number> => {
    try {
        const receiptsRef = collection(database, "receipts");
        
        const q = query(receiptsRef, where("createdAt", ">=", intervalToDate(interval)), where("type", "==", ReceiptType.EXPORT));
        const querySnapshot = await getDocs(q);
        let total = 0;
        querySnapshot.docs.forEach(doc => {
            total += doc.data().totalPrice;
        });
        return total;
    } catch (e) {
        console.log("Error getting receipts analysis", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getCostsAnalysisHelper = async (database: Firestore, interval: AnalysisPeriods): Promise<number> => {
    try {
        const receiptsRef = collection(database, "receipts");
        
        const q = query(receiptsRef, where("createdAt", ">=", intervalToDate(interval)), where("type", "==", ReceiptType.IMPORT));
        const querySnapshot = await getDocs(q);
        let total = 0;
        querySnapshot.docs.forEach(doc => {
            total += doc.data().totalPrice;
        });
        return total;
    } catch (e) {
        console.log("Error getting receipts analysis", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}

export const getProfitsAnalysisHelper = async (database: Firestore, interval: AnalysisPeriods): Promise<number> => {
    try {
        const receiptsRef = collection(database, "receipts");
        
        const q = query(receiptsRef, where("createdAt", ">=", intervalToDate(interval)));
        const querySnapshot = await getDocs(q);
        let total = 0;
        querySnapshot.docs.forEach(doc => {
            if(doc.data().type == ReceiptType.EXPORT)
                total += doc.data().totalPrice;
            if(doc.data().type == ReceiptType.IMPORT)
                total -= doc.data().totalPrice;
        });
        return total;
    } catch (e) {
        console.log("Error getting receipts analysis", e);
        if(e instanceof FirebaseError) {
            throw e
        }
        throw new FirebaseError(FIREBASE_ERROR);
    }
}