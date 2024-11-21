import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { createProduct, getAllProducts, getProduct } from '../backend/products';
import Layout from './Layout';
import { ExtendedVaultRec, Item, PageType, Product, VaultRec, VaultRecType } from '../utils/types';
import { useNavigate } from 'react-router-dom';
import { getVaultRecsHelper } from '../backend/vault';
import { showDate } from '../utils/date';

export default function VaultPage() {
    const { db } = useAuth();
    const [vaultRecs, setVaultRecs] = useState<Map<string, ExtendedVaultRec>>();
    const navigate = useNavigate();
    const [profit, setProfit] = useState(0);

    const getVaultRecs = async () => {
        try {
            const vaultRecs = await getVaultRecsHelper(db!);
            if (vaultRecs) {
                console.log("vaultRecs");
                console.log(vaultRecs);
                setVaultRecs(vaultRecs);
                let total = 0;
                vaultRecs.forEach(vaultRec => {
                    total += vaultRec.type == VaultRecType.OUT ? -vaultRec.amount : vaultRec.type == VaultRecType.IN ? vaultRec.amount : 0;
                });
                setProfit(total);
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

    useEffect(() => {
        getVaultRecs();
    }, []);

    return (
        <Layout page={PageType.VAULT}>
            <div className='top'>
                <h2 className='title'>Vault Records</h2>
                <div className='right-data'>
                    <div className='badges'>
                        <span className='badge weight'>Profit: {profit}</span>
                    </div>
                    <div className='btns'>
                        <button className='btn add'>
                            <span>Add New</span>
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <g id="Edit / Add_Plus">
                                    <path id="Vector" d="M6 12H12M12 12H18M12 12V18M12 12V6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className='bottom'>
                <div className='input-container'>
                    <input className='search' placeholder='Search Here' />
                    <svg className='icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className='bottom-contnet'>
                    {
                        vaultRecs ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>User Name</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        [...vaultRecs.entries()].map(([id, rec]) => {
                                            return <tr key={id} className='nohover' >
                                                <td className='table-link' onClick={() => navigate(`/${rec.type == VaultRecType.OUT ? 'suppliers' : 'clients'}/${rec.userUuid}`)}>{rec.userName}</td>
                                                <td>
                                                    <div className='td-contents'>
                                                        {rec.type == VaultRecType.OUT ? <>{
                                                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M12 3.25C12.4142 3.25 12.75 3.58579 12.75 4L12.75 18.1893L17.4697 13.4697C17.7626 13.1768 18.2374 13.1768 18.5303 13.4697C18.8232 13.7626 18.8232 14.2374 18.5303 14.5303L12.5303 20.5303C12.3897 20.671 12.1989 20.75 12 20.75C11.8011 20.75 11.6103 20.671 11.4697 20.5303L5.46967 14.5303C5.17678 14.2374 5.17678 13.7626 5.46967 13.4697C5.76256 13.1768 6.23744 13.1768 6.53033 13.4697L11.25 18.1893L11.25 4C11.25 3.58579 11.5858 3.25 12 3.25Z" fill="#c0392b" />
                                                            </svg>
                                                        } <span>-</span></> :
                                                            rec.type == VaultRecType.IN ? <>{
                                                                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M6.4569 9.73276C6.17123 10.0327 6.18281 10.5074 6.48276 10.7931C6.78271 11.0788 7.25744 11.0672 7.5431 10.7672L6.4569 9.73276ZM12.5431 5.51724C12.8288 5.21729 12.8172 4.74256 12.5172 4.4569C12.2173 4.17123 11.7426 4.18281 11.4569 4.48276L12.5431 5.51724ZM12.5431 4.48276C12.2574 4.18281 11.7827 4.17123 11.4828 4.4569C11.1828 4.74256 11.1712 5.21729 11.4569 5.51724L12.5431 4.48276ZM16.4569 10.7672C16.7426 11.0672 17.2173 11.0788 17.5172 10.7931C17.8172 10.5074 17.8288 10.0327 17.5431 9.73276L16.4569 10.7672ZM12.75 5C12.75 4.58579 12.4142 4.25 12 4.25C11.5858 4.25 11.25 4.58579 11.25 5H12.75ZM11.25 19C11.25 19.4142 11.5858 19.75 12 19.75C12.4142 19.75 12.75 19.4142 12.75 19H11.25ZM7.5431 10.7672L12.5431 5.51724L11.4569 4.48276L6.4569 9.73276L7.5431 10.7672ZM11.4569 5.51724L16.4569 10.7672L17.5431 9.73276L12.5431 4.48276L11.4569 5.51724ZM11.25 5V19H12.75V5H11.25Z" fill="#27ae60" />
                                                                </svg>
                                                            } <span>+</span></> :
                                                                "?"} {rec.amount}
                                                    </div>
                                                </td>
                                                <td>{showDate(rec.createdAt.toDate())}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table> :
                            <div>
                                There is no vault records yet
                            </div>
                    }
                </div>
            </div>
        </Layout>
    )
}
