import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

function SplashPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("SPlash");
        if (user) {
            navigate('/clients');
        } else {
            navigate('/login')
        }
    }, []);

    return <Loading />
}

export default SplashPage