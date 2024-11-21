import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { createProduct, getAllProducts, getProduct } from '../backend/products';
import Layout from './Layout';
import { Item, PageType, Product } from '../utils/types';
import { useNavigate } from 'react-router-dom';

export default function ProductsPage() {
    const { db } = useAuth();
    const [products, setProducts] = useState<Map<string, Product>>();
    const navigate = useNavigate();

    const addProduct = async (productName: string) => {
        try {
            const key = await createProduct(db!, productName);
            if (key) {
                console.log(key);
                // JOE: Handle successul creation
            }
        } catch (error) {
            console.log("ERROR");
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    /* showMessage({
                        message: 'Success',
                        description: 'حدث خطأ ما , برجاء المحاولة مرة أخري لاحقا ',
                        type: 'success',
                        duration: 3000,
                        floating: true,
                        autoHide: true,
                    }); */
                    // JOE: add this feature
                } else if (error.code === FIREBASE_NAME_EXISTS_ERROR) {
                    // JOE: ERROR CREATING THE INSTANCE
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const getProducts = async () => {
        try {
            const products = await getAllProducts(db!);
            if (products) {
                console.log("products");
                console.log(products);
                setProducts(products);
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
                } else {
                    console.error('An error occurred with code:', error.code);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    const getProductDetails = async (productUuid: string) => {
        try {
            const product = await getProduct(db!, productUuid);
            if (product) {
                console.log("product");
                console.log(product);
                // JOE: SET THE product
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
        getProducts();
        // addProduct("Apple");
        // getProductDetails("UOtbiREpGbbKvPESQUIM");
    }, []);

    return (
        <Layout page={PageType.PRODUCTS}>
            <div className='top'>
                <h2 className='title'>Products</h2>
                <button className='btn add'>
                    <span>Add New</span>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g id="Edit / Add_Plus">
                            <path id="Vector" d="M6 12H12M12 12H18M12 12V18M12 12V6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                    </svg>
                </button>
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
                        products ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Available Weight</th>
                                        <th>Available Boxes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        [...products.entries()].map(([id, product]) => {
                                            return <tr key={id} onClick={() => navigate(`/products/${id}`)}>
                                                <td>{product.name}</td>
                                                <td>{product.items ? calculateWeight(product.items) : 0}</td>
                                                <td>{product.items ? calculateBoxes(product.items) : 0}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table> :
                            <div>
                                There is no products yet, add a client to interact with him
                            </div>
                    }
                </div>
            </div>
        </Layout>
    )
}
