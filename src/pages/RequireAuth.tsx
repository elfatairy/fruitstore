import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Roles } from "../utils/types";
import { ReactNode } from "react";

export const RequireAuth = ({ children, role = Roles.STORE }: {children: ReactNode, role?: Roles}) => {
    let {user, initializing} = useAuth();
    const navigate = useNavigate();
    // JOE: get the location (depending on the routing system)

    if(initializing) return null; 

    if (!user) {
        setTimeout(() => {
            navigate('/login');
        }, 3000);

        return <div>
            You must log in first 
        </div> // JOE : to make better ui
    }

    if(role === Roles.ADMIN) {
        if(user?.email !== "admin@admin.com") {
            // JOE: handle unauthorized (maybe just redirecting to login)
        }
    }

    return <>
        {children}
    </>;
}