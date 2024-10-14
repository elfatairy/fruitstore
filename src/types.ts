import { Timestamp } from "firebase/firestore"

export type userCredential = {
    email: string,
    password: string
}

export enum Roles {
    STORE,
    ADMIN
}

export type Client = {
    username: string, 
    number: string,
    balance: number,
    createdAt: Timestamp,
    updatedAt: Timestamp
}

export type Supplier = {
    username: string, 
    number: string,
    balance: number,
    createdAt: Timestamp,
    updatedAt: Timestamp
}