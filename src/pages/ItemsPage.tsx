import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { createProduct, getAllProducts, getProduct } from '../backend/products';
import Layout from './Layout';
import { Item, PageType, Product } from '../types';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

export default function ItemsPage() {
    const { db } = useAuth();
    const { productUid } = useParams();
    const [product, setProduct] = useState<Product>();
    const navigate = useNavigate();

    const getProductDetails = async (productUuid: string) => {
        try {
            const product = await getProduct(db!, productUuid);
            if (product) {
                console.log("product");
                console.log(product);
                setProduct(product);
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

    const calculateWeight = (items: Map<string, Item>) => {
        let weight = 0;
        items.forEach((item, key) => {
            weight += item.mass;
        })
        return weight;
    }

    const calculateBoxes = (items: Map<string, Item>) => {
        let weight = 0;
        items.forEach((item, key) => {
            weight += item.boxes;
        })
        return weight;
    }

    useEffect(() => {
        if (productUid) {
            getProductDetails(productUid);
        }
    }, []);

    if (!product) {
        return <div>
            Loading....
        </div>
    }

    return (
        <Layout page={PageType.PRODUCTS}>
            <div className='top'>
                <h2 className='title'><NavLink className="link" to="/products">Products</NavLink> / {product.name}</h2>
                <div className='badges'>
                    <span className='badge weight'>Total Weight: {product.items ? calculateWeight(product.items) : 0}</span>
                    <span className='badge boxes'>Total Boxes: {product.items ? calculateBoxes(product.items) : 0}</span>
                </div>
            </div>
            <div className='bottom'>
                <div className='input-container'>
                    <input className='search' placeholder='Search Here' />
                    <svg className='icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                {
                    product.items ?
                        <table>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Available Weight</th>
                                <th>Available Boxes</th>
                                <th>Imported At</th>
                            </tr>
                            {
                                [...product.items.entries()].map(([id, item]) => {
                                    return <tr className='nohover'>
                                        <td onClick={() => navigate(`/suppliers/${item.supplierUuid}`)} className='supplierUid'>{item.supplierName}</td>
                                        <td>{item.mass}</td>
                                        <td>{item.boxes}</td>
                                        <td>{item.createdAt.toDate().toUTCString()}</td>
                                    </tr>
                                })
                            }
                        </table> :
                        <div>
                            There is no products yet, add a client to interact with him
                        </div>
                }
            </div>
        </Layout>
    )
}
