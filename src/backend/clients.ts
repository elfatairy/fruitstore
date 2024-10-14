import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore";
// import { attemptFirebasePush } from "./firebase";
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, REQUEST_LIMIT } from "../config/Constants";
import { FirebaseError } from "../errors/FirebaseError";
import { Client } from "../types";

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
            throw new FirebaseError(FIREBASE_ERROR);
        }
    } catch (e) {
        console.log("Error getting a client", e);
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
        console.log("Error adding item", e);
        throw new FirebaseError(FIREBASE_ERROR);
    }
}