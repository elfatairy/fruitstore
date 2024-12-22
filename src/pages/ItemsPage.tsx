import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { FIREBASE_CREATING_ERROR, FIREBASE_ERROR, FIREBASE_NAME_EXISTS_ERROR, FIREBASE_NOTFOUND_ERROR } from '../config/Constants';
import { FirebaseError } from '../errors/FirebaseError';
import { createProduct, getAllProducts, getProduct } from '../backend/products';
import Layout from './Layout';
import { Item, PageType, Product } from '../utils/types';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { formatArabicDate } from '../utils/date';
import Loading from '../components/Loading';

export default function ItemsPage() {
    const { db } = useAuth();
    const { productUid } = useParams();
    const [product, setProduct] = useState<Product>();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const getProductDetails = async (productUuid: string) => {
        try {
            const product = await getProduct(db!, productUuid);
            if (product) {
                setProduct(product);
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === FIREBASE_ERROR) {
                    console.log("ERROR");
                } else if (error.code === FIREBASE_NOTFOUND_ERROR) {
                    // Handle not found
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
        items.forEach((item) => {
            weight += item.mass;
        })
        return weight;
    }

    const calculateBoxes = (items: Map<string, Item>) => {
        let boxes = 0;
        items.forEach((item) => {
            boxes += item.boxes;
        })
        return boxes;
    }

    // Filter items based on search query
    const filteredItems = product?.items ? 
        new Map([...product.items.entries()].filter(([_, item]) => 
            item.supplierName?.toLowerCase().includes(searchQuery.toLowerCase())
        ))
        : new Map();

    useEffect(() => {
        if (productUid) {
            getProductDetails(productUid);
        }
    }, [productUid]);

    if (!product) {
        return <Loading />
    }

    return (
        <Layout page={PageType.PRODUCTS}>
            <div className='top'>
                <h2 className='title'>
                    <NavLink className="link" to="/products">المنتجات</NavLink> / {product.name}
                </h2>
                <div className='badges'>
                    <span className='badge weight'>الوزن الكلي: {product.items ? calculateWeight(product.items) : 0}</span>
                    <span className='badge boxes'>عدد الصناديق: {product.items ? calculateBoxes(product.items) : 0}</span>
                </div>
            </div>
            <div className='bottom'>
                <div className='input-container'>
                    <input 
                        className='search' 
                        placeholder='ابحث هنا'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg className='icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className='bottom-contnet'>
                    {
                        product.items && product.items.size > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>تاريخ الإضافة</th>
                                        <th>عدد الصناديق المتاحة</th>
                                        <th>الوزن المتاح</th>
                                        <th>اسم المورد</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        [...filteredItems.entries()].map(([id, item]) => {
                                            return <tr key={id} className='nohover'>
                                                <td>{formatArabicDate(item.createdAt.toDate())}</td>
                                                <td>{item.boxes}</td>
                                                <td>{item.mass}</td>
                                                <td onClick={() => navigate(`/suppliers/${item.supplierUuid}`)} className='table-link'>
                                                    {item.supplierName}
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        ) : (
                            <div>
                                لا توجد منتجات حتى الآن، أضف منتج للتفاعل معه
                            </div>
                        )
                    }
                </div>
            </div>
        </Layout>
    )
}