import { Timestamp } from "firebase/firestore"
import { EnumType } from "typescript"

export enum PageType {
    CLIENTS,
    PRODUCTS,
    SUPPLIERS,
    VAULT
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

export type Item  = {
    productUuid: string,
    supplierUuid: string,
    supplierName?: string,
    receiptItemUuid: string,
    mass: number,
    boxes: number,
    price: number,
    createdAt: Timestamp, 
    updatedAt: Timestamp
}
export type ExtendedItem = Item & {
    productName: string
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
    updatedAt: Timestamp,
    itemsObject: Record<string, true>,
    vaultRecsObject: Record<string, true>
}

export type FullReceipt = Receipt & {
    userName: string,
    items: ClientItem[] | Item[],
    vaultRecs: VaultRec[]
}

export enum AnalysisPeriods {
    DAY, 
    WEEK, 
    MONTH,
    YEAR, 
    ALL
}

export enum VaultRecType {
    OUT,
    IN
}

export type VaultRec = {
    userUuid: string,
    amount: number, 
    type: VaultRecType,
    createdAt: Timestamp
}

export type ExtendedVaultRec = VaultRec & {
    userName: string
}

export type ClientItem  = {
    itemUuid: string,
    clientUuid: string,
    receiptItemUuid: string,
    mass: number,
    boxes: number,
    price: number,
    createdAt: Timestamp, 
    updatedAt: Timestamp
}
export type ExtendedClientItem = ClientItem & {
    productName: string,
    supplierUuid: string,
    supplierName: string,
    importDate: Timestamp
}