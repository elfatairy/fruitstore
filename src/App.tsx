import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { Roles } from './utils/types';
import { RequireAuth } from './pages/RequireAuth';
import Loading from './components/Loading';
import VaultPage from './pages/VaultPage';
import SupplierReceiptsPage from './pages/SupplierReceiptsPage';
import ClientReceiptsPage from './pages/ClientReceiptsPage';

// Pages
const SplashPage = React.lazy(() => import('./pages/SplashPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const ClientsPage = React.lazy(() => import('./pages/ClientsPage'));
const ClientPage = React.lazy(() => import('./pages/ClientPage'));
const SuppliersPage = React.lazy(() => import('./pages/SuppliersPage'));
const SupplierPage = React.lazy(() => import('./pages/SupplierPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const ItemsPage = React.lazy(() => import('./pages/ItemsPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

// Router Configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/clients",
    element: (
      <RequireAuth>
        <ClientsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/clients/:clientUuid",
    element: (
      <RequireAuth>
        <ClientPage />
      </RequireAuth>
    ),
  },
  {
    path: "/clients/:clientUuid/receipts",
    element: (
      <RequireAuth>
        <ClientReceiptsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/suppliers",
    element: (
      <RequireAuth>
        <SuppliersPage />
      </RequireAuth>
    ),
  },
  {
    path: "/suppliers/:supplierUuid",
    element: (
      <RequireAuth>
        <SupplierPage />
      </RequireAuth>
    ),
  },
  {
    path: "/suppliers/:supplierUuid/receipts",
    element: (
      <RequireAuth>
        <SupplierReceiptsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/suppliers/:supplierUuid/receipts",
    element: (
      <RequireAuth>
        <SupplierPage />
      </RequireAuth>
    ),
  },
  {
    path: "/products",
    element: (
      <RequireAuth>
        <ProductsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/products/:productUid",
    element: (
      <RequireAuth>
        <ItemsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/items",
    element: (
      <RequireAuth>
        <ItemsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin",
    element: (
      <RequireAuth role={Roles.ADMIN}>
        <AdminPage />
      </RequireAuth>
    ),
  },
  {
    path: "/vault",
    element: (
      <RequireAuth>
        <VaultPage />
      </RequireAuth>
    ),
  },
]);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
