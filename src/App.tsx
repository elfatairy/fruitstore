import { useEffect } from 'react';
import './App.css';
import { RequireAuth, useAuth } from './context/AuthContext';
import ProductsPage from './pages/ProductsPage';
import ItemsPage from './pages/ItemsPage';
import SuppliersPage from './pages/SuppliersPage';
import ClientsPage from './pages/ClientsPage';

function App() {
  const { signin } = useAuth();

  useEffect(() => {
    // console.log(auth.currentUser?.email);
  }, []);

  const loginFunc = (email: string, password: string) => {
    // JOE: validation
    // JOE: to login use this "signin"
  }

  return (
    <>
      <RequireAuth>
        <ClientsPage />
        {/* <SuppliersPage /> */}
        {/* <ProductsPage /> */}
        {/* <ItemsPage /> */}
      </RequireAuth>
      {/* JOE: put the routes here and add this wrapper to every component requiring authorization 
      <RequireAuth></RequireAuth> if it requires admin role add this property role={roles.ADMIN}  */}
    </>
  );
}

export default App;
