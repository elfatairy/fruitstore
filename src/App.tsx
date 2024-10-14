import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { onValue, ref } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import AuthProvider, { RequireAuth, useAuth } from './context/AuthContext';
import ClientsPage from './pages/ClientsPage';
import SuppliersPage from './pages/SuppliersPage';

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
        {/* <ClientsPage /> */}
        <SuppliersPage />
      </RequireAuth>
      {/* JOE: put the routes here and add this wrapper to every component requiring authorization 
      <RequireAuth></RequireAuth> if it requires admin role add this property role={roles.ADMIN}  */}
    </>
  );
}

export default App;
