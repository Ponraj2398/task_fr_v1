// import logo from './logo.svg';
// import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup"
import Indexpage from './IndexPage'
import Admin from './Admin'
import Checkout from './CheckOut'
import Payment from './Payment'
import PreLoader from './PreLoader'
import PrivateRoute from './PrivateRoute';  // Import the PrivateRoute component

import './index.css'
function App() {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);
  return (
    <BrowserRouter>
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <PreLoader load={load} />
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          {/* Protect these routes with PrivateRoute */}
          <Route path="/indexpage" element={<PrivateRoute element={<Indexpage />} />} />
          <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
          <Route path="/checkout" element={<PrivateRoute element={<Checkout />} />} />
          <Route path="/payment" element={<PrivateRoute element={<Payment />} />} />
          {/* <Route path="/indexpage" element={<Indexpage />}></Route>
          <Route path="/admin" element={<Admin />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/payment" element={<Payment />}></Route> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
