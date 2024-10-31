import { useEffect } from 'react';
import './App.css';
import { RequireAuth, useAuth } from './context/AuthContext';
import ProductsPage from './pages/ProductsPage';
import ItemsPage from './pages/ItemsPage';
import SuppliersPage from './pages/SuppliersPage';
import ClientsPage from './pages/ClientsPage';
import { Roles } from './types';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ClientPage from './pages/ClientPage';
import SupplierPage from './pages/SupplierPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RequireAuth>Test</RequireAuth>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/clients",
    element: <RequireAuth><ClientsPage /></RequireAuth>,
  },
  {
    path: "/clients/:clientUid",
    element: <RequireAuth><ClientPage /></RequireAuth>,
  },
  {
    path: "/suppliers",
    element: <RequireAuth><SuppliersPage /></RequireAuth>,
  },
  {
    path: "/suppliers/:supplierUid",
    element: <RequireAuth><SupplierPage /></RequireAuth>,
  },
  {
    path: "/products",
    element: <RequireAuth><ProductsPage /></RequireAuth>,
  },
  {
    path: "/products/:productUid",
    element: <RequireAuth><ItemsPage /></RequireAuth>,
  },
  {
    path: "/items",
    element: <RequireAuth><ItemsPage /></RequireAuth>,
  },
  {
    path: "/admin",
    element: <RequireAuth role={Roles.ADMIN}><AdminPage /></RequireAuth>,
  },
]);

function App() {
  const { signin, user } = useAuth();

  useEffect(() => {
    // console.log(auth.currentUser?.email);
  }, []);

  const loginFunc = (email: string, password: string) => {
    // JOE: validation
    // JOE: to login use this "signin"
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
