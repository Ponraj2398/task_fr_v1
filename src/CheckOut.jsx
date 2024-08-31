import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';
import { Button } from 'react-bootstrap';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart = [], subtotal = 0, gst = 0, deliveryCharges = 0, overallTotal = 0 } = location.state || {};

    const calculateItemTotal = (cartItem) => {
        return cartItem.price * cartItem.quantity;
    };
    const handleBuyNow = () => {
        navigate('/payment', { state: { overallTotal } }); // Pass overallTotal to the Payment page
    };
    return (
        <div className="checkout-container">
            <h2>Checkout Page</h2>
            {cart.length > 0 ? (
                <div className="checkout-content">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((cartItem) => (
                                <tr key={cartItem._id}>
                                    <td>
                                        <img
                                            src={`https://task-backend-v1-fkb7.onrender.com/public/data/uploads/${cartItem.image}`}
                                            className="order-img"
                                            alt={cartItem.name}
                                            style={{ width: '200px' }}
                                        />
                                        {cartItem.name}
                                    </td>
                                    <td>{cartItem.quantity}</td>
                                    <td>Rs.{calculateItemTotal(cartItem).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="order-summary">
                        <table className="summary-table">
                            <tbody>
                                <tr>
                                    <td>Subtotal</td>
                                    <td>Rs.{subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Tax (5%)</td>
                                    <td>Rs.{gst}</td>
                                </tr>
                                <tr>
                                    <td>Delivery Charges</td>
                                    <td>Rs.{deliveryCharges}</td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td>Rs.{overallTotal}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* <p>Total Items in Cart: {cart.length}</p> */}
                    </div>
                </div>
            ) : (
                <p>No items in the cart.</p>
            )}
            <div className='text-center'>
            <Button variant="danger" onClick={handleBuyNow}>Buy Now</Button>
            </div>
        </div>
    );
};

export default Checkout;
