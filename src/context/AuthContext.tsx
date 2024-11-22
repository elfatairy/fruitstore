import { initializeApp } from "firebase/app";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
} from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Roles, userCredential } from "../utils/types";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const firebaseConfig = {
    apiKey: "AIzaSyDUKW-AkNKBgVKty2AQHkwpWWSF-N9EXyY",
    authDomain: "fruitstore-8ac8e.firebaseapp.com",
    projectId: "fruitstore-8ac8e",
    storageBucket: "fruitstore-8ac8e.appspot.com",
    messagingSenderId: "983735602285",
    appId: "1:983735602285:web:499c14a7440e459e9dc364",
    measurementId: "G-E2WPM18DZL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

type AuthContextType = {
    initializing: Boolean,
    user: User | null,
    signin:  (newUser: userCredential, successCallback?: () => void, errorCallback?: (msg: string) => void) => Promise<void>,
    signout: (callback: () => void) => void,
    db: Firestore
}

let AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
    let [initializing, setInitializing] = useState(true);
    let [user, setUser] = useState<User | null>(null);

    let authChanged = useCallback((firebaseUser: User | null) => {
        if (firebaseUser) setUser(firebaseUser);
        setInitializing(false);

        console.log({ firebaseUser });
    }, []);

    useEffect(() => {
        const subscriber = onAuthStateChanged(auth, authChanged);
        return subscriber;
    }, [authChanged]);

    let signin = async (newUser: userCredential, successCallback: () => void = () => { }, errorCallback: (msg: string) => void = () => { }) => {
        setInitializing(true);
        try {
            let res = await signInWithEmailAndPassword(
                auth,
                newUser.email,
                newUser.password
            );
            if (res.user) return successCallback();

            return errorCallback("Wrong credentials");
        } catch (error) {
            return errorCallback("Something went Wrong.");
        }
    };

    let signout = async (callback: () => void) => {
        await signOut(auth);
        setUser(null);
        callback();
    };

    if(initializing) return <Loading />;
    
    return (
        <AuthContext.Provider value={{ initializing, user, signin, signout, db }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within a AuthContext');
    }
    return context;
}
