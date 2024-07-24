// import logo from './logo.svg';
// import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./Login";
import Signup from "./Signup"
import Indexpage from './IndexPage'
import Admin from './Admin'
import Checkout from './CheckOut'
import Payment from './Payment'
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/indexpage" element={<Indexpage />}></Route>
          <Route path="/admin" element={<Admin />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/payment" element={<Payment />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
