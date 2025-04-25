import React from 'react'; 
import Home from './components/Home'
import Auth from './components/Auth';
import Upload from './components/Upload';
import { Routes, Route } from 'react-router-dom'; 
// import {Toaster} from 'react-hot-toast'

const App = () => {
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth/>} />
      <Route path="/upload" element={<Upload/>} />


    </Routes>
  );
};

export default App;