import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateBlog from './pages/CreateBlog';
import ProtectedRoute from './components/ProtectedRoute';
import BlogDetail from './pages/BlogDetail';
import UserProfile from './pages/UserProfile';



function App() {
  return (
    <>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path='/create-blog'
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
            
          }/>
          
       <Route path='/blog/:id' element={<ProtectedRoute><BlogDetail /></ProtectedRoute>}/>
       <Route path='/userprofile' element={<ProtectedRoute><UserProfile /></ProtectedRoute>}/>
      </Routes>
    </>
  );
}

export default App;