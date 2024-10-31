import { Timestamp } from "firebase/firestore"
import { EnumType } from "typescript"

export enum PageType {
    CLIENTS,
    PRODUCTS,
    SUPPLIERS
}

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

export type Product = {
    name: string,
    items?: Map<string, Item>,
    createdAt: Timestamp, 
    updatedAt: Timestamp
}

export type Item = {
    productUuid: string,
    supplierUuid: string,
    supplierName?: string,
    receiptItemUuid: string,
    mass: number,
    boxes: number
    createdAt: Timestamp, 
    updatedAt: Timestamp
}

export enum ReceiptType {
    IMPORT, EXPORT
}
export type Receipt = {
    type: ReceiptType,
    userUuid: string, 
    balanceBefore: number,
    totalPrice: number,
    moneyPaid: number,
    createdAt: Timestamp, 
    updatedAt: Timestamp
}

export type FullReceiptItem = {
    itemUuid: string, 
    supplierUuid: string, 
    supplierName: string,
    productName: string,
    mass: number,
    boxes: number,
    price: number
}

export type FullReceipt = {
    type: ReceiptType,
    userUuid: string, 
    userName: string,
    balanceBefore: number,
    totalPrice: number,
    moneyPaid: number,
    items: FullReceiptItem[],
    createdAt: Timestamp, 
    updatedAt: Timestamp
}

export type ReceiptItem = {
    receiptUuid: string,
    itemUuid: string,
    mass: number,
    boxes: number,
    price: number
}

export enum AnalysisPeriods {
    DAY, 
    WEEK, 
    MONTH,
    YEAR, 
    ALL
}