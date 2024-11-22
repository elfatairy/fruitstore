import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { FIREBASE_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { getReceipt } from '../backend/receipts';
import Layout from './Layout';
import { Client, ExtendedItem, Item, PageType, Receipt, Supplier, VaultRec } from '../utils/types';
import { NavLink, useParams } from 'react-router-dom';
import { getSupplier, getSupplierItemsHelper, getSupplierReceiptsHelper, getSupplierVaultRecsHelper } from '../backend/suppliers';
import { showDate } from '../utils/date';
import Loading from '../components/Loading';
import { payHelper } from '../backend/vault';
import RangePicker from '../components/RangePicker';

export default function SupplierReceiptsPage() {
    const { db } = useAuth();
    const { supplierUuid } = useParams();
    const [first, setFirst] = useState(true);
    const [supplier, setSupplier] = useState<Supplier>();
    const [receipts, setReceipts] = useState<Map<string, Receipt>>();

    const getSupplierDetails = async (supplierUuid: string) => {
        try {
            const supplier = await getSupplier(db!, supplierUuid);
            if (supplier) {
                console.log("supplier");
                console.log(supplier);
                setSupplier(supplier)
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.log("ERROR");
                    // JOE: FIX this
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                } else if (error.code === FIREBASE_NOTFOUND_ERROR) {
                    // JOE
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const getSupplierReceipts = async (supplierUuid: string, startDate?: Date, endDate?: Date) => {
        try {
            const receipts = await getSupplierReceiptsHelper(db!, supplierUuid, startDate, endDate);
            if (receipts) {
                console.log("receipts");
                console.log(receipts);
                setReceipts(receipts);
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.log("ERROR");
                    // JOE: FIX this
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                } else if (error.code === FIREBASE_NOTFOUND_ERROR) {
                    // JOE
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const getReceiptDetails = async (receiptUuid: string) => {
        try {
            const receipt = await getReceipt(db!, receiptUuid);
            if (receipt) {
                console.log("receipt");
                console.log(receipt);
                // JOE: SET THE receipt
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.log("ERROR");
                    // JOE: FIX this
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                } else if (error.code === FIREBASE_NOTFOUND_ERROR) {
                    // JOE
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const getRangedData = async (startDate?: Date, endDate?: Date) => {
        if (!supplierUuid) return;

        await getSupplierReceipts(supplierUuid, startDate, endDate);
    }

    useEffect(() => {
        if (supplierUuid) {
            getSupplierDetails(supplierUuid);
            getSupplierReceipts(supplierUuid);
        }

        if (first) {
            setFirst(false);
            // getReceiptDetails("qiq3adDDVBBsvHLN9dyk");
            // exportItems("Qu2rJVh5vyDxUapqd4iK", 100, [
            //     {
            //         itemUuid: "Zx1SqeVgqxBOOQjsI0Y6",
            //         mass: 5,
            //         boxes: 1,
            //         price: 20
            //     }
            // ]);
        }
    }, []);

    if (!supplier) {
        return <Loading />
    }

    return (
        <Layout page={PageType.SUPPLIERS}>
            <div className='top'>
                <h2 className='title'><NavLink className="link" to="/suppliers">Suppliers</NavLink> / <NavLink className="link" to={`/suppliers/${supplierUuid}`}>{supplier.username}</NavLink> / Receipts</h2>
                <div className='btns'>
                    <button className='receipt btn'>
                        <span>Make Receipt</span>
                        <svg width="800px" height="800px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.775 17.9344L6.847 18.8784C6.77321 18.9152 6.68572 18.9115 6.61528 18.8687C6.54484 18.8259 6.50131 18.7499 6.5 18.6674V5.33343C6.50165 5.25118 6.54531 5.17551 6.61569 5.13291C6.68607 5.09032 6.77337 5.08674 6.847 5.12343L8.775 6.06743C8.85208 6.10494 8.94319 6.09925 9.015 6.05243L10.567 5.03943C10.6479 4.98686 10.7521 4.98686 10.833 5.03943L12.367 6.03943C12.4479 6.09201 12.5521 6.09201 12.633 6.03943L14.167 5.03943C14.2479 4.98686 14.3521 4.98686 14.433 5.03943L15.984 6.05243C16.0558 6.09925 16.1469 6.10494 16.224 6.06743L18.153 5.12343C18.2266 5.08674 18.3139 5.09032 18.3843 5.13291C18.4547 5.17551 18.4984 5.25118 18.5 5.33343V18.6674C18.4984 18.7497 18.4547 18.8254 18.3843 18.868C18.3139 18.9106 18.2266 18.9141 18.153 18.8774L16.225 17.9334C16.1479 17.8959 16.0568 17.9016 15.985 17.9484L14.433 18.9614C14.3521 19.014 14.2479 19.014 14.167 18.9614L12.633 17.9614C12.5521 17.9089 12.4479 17.9089 12.367 17.9614L10.833 18.9614C10.7521 19.014 10.6479 19.014 10.567 18.9614L9.016 17.9484C8.94376 17.9016 8.85218 17.8963 8.775 17.9344Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.5 10.2505C9.08579 10.2505 8.75 10.5863 8.75 11.0005C8.75 11.4147 9.08579 11.7505 9.5 11.7505V10.2505ZM15.5 11.7505C15.9142 11.7505 16.25 11.4147 16.25 11.0005C16.25 10.5863 15.9142 10.2505 15.5 10.2505V11.7505ZM10.5 12.2505C10.0858 12.2505 9.75 12.5863 9.75 13.0005C9.75 13.4147 10.0858 13.7505 10.5 13.7505V12.2505ZM14.5 13.7505C14.9142 13.7505 15.25 13.4147 15.25 13.0005C15.25 12.5863 14.9142 12.2505 14.5 12.2505V13.7505ZM9.5 11.7505H15.5V10.2505H9.5V11.7505ZM10.5 13.7505H14.5V12.2505H10.5V13.7505Z" fill="#fff" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className='bottom'>
                <div className='bottom-header'>
                    <div className='input-container'>
                        <input className='search' placeholder='Search Here' />
                        <svg className='icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <RangePicker getFunction={getRangedData} />
                </div>
                <div className='bottom-contnet'>
                    {
                        receipts ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>Receipt Number</th>
                                        <th>Receipt Date</th>
                                        <th>Total Price</th>
                                        <th>Money Paid</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        [...receipts.entries()].map(([id, receipt]) => {
                                            return <tr key={id}>
                                                <td>{id}</td>
                                                <td>{receipt.createdAt.toDate().toUTCString()}</td>
                                                <td>{receipt.totalPrice}</td>
                                                <td>{receipt.moneyPaid}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table> :
                            <div>
                                There is no receipts yet, add a client to interact with him
                            </div>
                    }
                </div>
            </div>
        </Layout>
    )
}
