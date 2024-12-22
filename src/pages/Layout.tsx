import React, { ReactNode } from 'react'
import CarrotImg from '../assets/carrot.png';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageType } from '../utils/types';


function Layout({ children, page }: { children: ReactNode, page: PageType }) {
    const { signout } = useAuth();
    const navigate = useNavigate();

    const logout = () => {
        signout(() => {
            // JOE: show success message;
            navigate('/login');
        })
    }

    return (
        <div className='layout'>
            <header>
                <div className='left'>
                    <h1>شادر أولاد عبده</h1>
                    <img src={CarrotImg} alt="logo" className='logo' />
                </div>
                <div className="right">
                    <button onClick={logout} className='btn'>
                        {/* <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.2429 22 18.8286 22 16.0002 22H15.0002C12.1718 22 10.7576 22 9.87889 21.1213C9.11051 20.3529 9.01406 19.175 9.00195 17" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg> */}
                        تسجيل خروج
                    </button>
                </div>
            </header>
            <section className='body'>
                <aside>
                    <span className='title'>القائمة</span>
                    <ul>
                        <li className={page == PageType.CLIENTS ? 'active' : ''} onClick={() => navigate('/clients')}>
                            <svg viewBox="0 0 36 36" version="1.1" strokeWidth={0} preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <title>users-solid</title>
                                <path d="M12,16.14q-.43,0-.87,0a8.67,8.67,0,0,0-6.43,2.52l-.24.28v8.28H8.54v-4.7l.55-.62.25-.29a11,11,0,0,1,4.71-2.86A6.59,6.59,0,0,1,12,16.14Z"></path><path d="M31.34,18.63a8.67,8.67,0,0,0-6.43-2.52,10.47,10.47,0,0,0-1.09.06,6.59,6.59,0,0,1-2,2.45,10.91,10.91,0,0,1,5,3l.25.28.54.62v4.71h3.94V18.91Z"></path><path d="M11.1,14.19c.11,0,.2,0,.31,0a6.45,6.45,0,0,1,3.11-6.29,4.09,4.09,0,1,0-3.42,6.33Z"></path><path d="M24.43,13.44a6.54,6.54,0,0,1,0,.69,4.09,4.09,0,0,0,.58.05h.19A4.09,4.09,0,1,0,21.47,8,6.53,6.53,0,0,1,24.43,13.44Z"></path><circle cx="17.87" cy="13.45" r="4.47"></circle><path d="M18.11,20.3A9.69,9.69,0,0,0,11,23l-.25.28v6.33a1.57,1.57,0,0,0,1.6,1.54H23.84a1.57,1.57,0,0,0,1.6-1.54V23.3L25.2,23A9.58,9.58,0,0,0,18.11,20.3Z"></path>
                                <rect x="0" y="0" width="36" height="36" fillOpacity="0" />
                            </svg>
                            <span className='badge'>العملاء</span>
                        </li>
                        <li className={page == PageType.SUPPLIERS ? 'active' : ''} onClick={() => navigate('/suppliers')}>
                            <svg viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><title /><path d="M181.75,42.5c-3-13-15-22.5-29-22.5h-105a30.6,30.6,0,0,0-29.5,22.5l-10.5,40c-2,7,1,14,7,18l2,1.5c3,1.5,5.5,3,8.5,3.5V160a20.06,20.06,0,0,0,20,20h23.5a20.06,20.06,0,0,0,20-20V140h27.5v20a20.06,20.06,0,0,0,20,20h19a20.06,20.06,0,0,0,20-20V105.5a22.09,22.09,0,0,0,8-3l2-1.5a16.87,16.87,0,0,0,7-18.5ZM156.25,160h-20V140a20.06,20.06,0,0,0-20-20H88.75a20.06,20.06,0,0,0-20,20v20H45.25V100c6.5-2.5,13.5-1.5,19.5,2a21.07,21.07,0,0,0,24,0,21.07,21.07,0,0,1,24,0,21.07,21.07,0,0,0,24,0,20.87,20.87,0,0,1,19.5-2Zm14.5-74.5a40.69,40.69,0,0,0-46,0,.94.94,0,0,1-1.5,0,40.69,40.69,0,0,0-46,0,.94.94,0,0,1-1.5,0,40.69,40.69,0,0,0-46,0,.94.94,0,0,1-1.5,0l9.5-38c1-4.5,5-7.5,10-7.5h105.5a9.64,9.64,0,0,1,9.5,7.5l9.5,38S171.25,86,170.75,85.5Z" /></svg>
                            <span className='badge'>الموردين</span>
                        </li>
                        <li className={page == PageType.PRODUCTS ? 'active' : ''} onClick={() => navigate('/products')}>
                            <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <title>product</title>
                                <g id="icon" transform="translate(64.000000, 34.346667)">
                                    <path d="M192,7.10542736e-15 L384,110.851252 L384,332.553755 L192,443.405007 L1.42108547e-14,332.553755 L1.42108547e-14,110.851252 L192,7.10542736e-15 Z M127.999,206.918 L128,357.189 L170.666667,381.824 L170.666667,231.552 L127.999,206.918 Z M42.6666667,157.653333 L42.6666667,307.920144 L85.333,332.555 L85.333,182.286 L42.6666667,157.653333 Z M275.991,97.759 L150.413,170.595 L192,194.605531 L317.866667,121.936377 L275.991,97.759 Z M192,49.267223 L66.1333333,121.936377 L107.795,145.989 L233.374,73.154 L192,49.267223 Z" id="Combined-Shape">

                                    </path>
                                </g>
                            </svg>
                            <span className='badge'>المنتجات</span>
                        </li>
                        <li className={page == PageType.VAULT ? 'active' : ''} onClick={() => navigate('/vault')}>
                            <svg width="800px" height="800px" viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" style={{ fill: "none", strokeMiterlimit:10, strokeWidth: "1.91px"}}><defs></defs>
                                <rect x="1.48" y="1.5" width="21.04" height="19.13" rx="1.91" />
                                <line x1="4.35" y1="23.5" x2="4.35" y2="20.63" />
                                <line x1="19.65" y1="23.5" x2="19.65" y2="20.63" />
                                <circle cx="10.09" cy="11.07" r="4.78" />
                                <line x1="17.74" y1="9.15" x2="19.65" y2="9.15" />
                                <line x1="17.74" y1="12.98" x2="19.65" y2="12.98" />
                                <line x1="17.74" y1="16.8" x2="19.65" y2="16.8" />
                                <line x1="10.09" y1="4.37" x2="10.09" y2="11.07" />
                                <line x1="4.35" y1="15.85" x2="10.09" y2="11.07" />
                                <line x1="15.83" y1="15.85" x2="10.09" y2="11.07" />
                            </svg>
                            <span className='badge'>الخزنة</span>
                        </li>
                    </ul>
                </aside>
                <section className='contents'>
                    {children}
                </section>
            </section>
        </div>
    )
}

export default Layout