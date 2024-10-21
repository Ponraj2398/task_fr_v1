import React, { useEffect, useState } from 'react';
import './App.css'; // Import your component-specific CSS file
import img from '../src/images/pizzahutimg1.jpg'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";

const IndexComponent = () => {

    const [cart, setCart] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [additems, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);
    const [isSidebarVisible, setSidebarVisible] = useState(true); // Sidebar visibility state

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible); // Toggle sidebar visibility
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://task-backend-v1-fkb7.onrender.com/api/product/list');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    const addToFavorite = (product) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.find((item) => item._id === product._id)) {
                return prevFavorites.filter((item) => item._id !== product._id);
            } else {
                return [...prevFavorites, product];
            }
        });
        console.log("Favorite Item Added..", product);
    };
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingCartItem = prevCart.find(item => item._id === product._id);
            if (existingCartItem) {
                return prevCart.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const increaseQuantity = (productId) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (productId) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item._id === productId && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };


    const calculateItemTotal = (cartItem) => {
        return cartItem.price * cartItem.quantity;
    };

    const subtotal = cart.reduce((acc, cartItem) => acc + cartItem.price * cartItem.quantity, 0);
    const gst = (subtotal * 0.05).toFixed(2);
    const deliveryCharges = cart.length > 0 ? 5 : 0;
    const overallTotal = (parseFloat(subtotal) + parseFloat(gst) + deliveryCharges).toFixed(2);
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const goToCheckoutPage = () => {
        navigate('/checkout', { state: { cart, subtotal, gst, deliveryCharges, overallTotal } });
    };
    const Logout = () => {
        // On logout, remove the token or flag
        localStorage.removeItem('isAuthenticated');
        Swal.fire({
            title: "Good job!",
            text: "You are LoggedOut Successfully!",
            icon: "success"
        });
        navigate('/')
    }
    return (
        <div>
            <div className="logo">
                <div><h2><strong className="box-pizza">Box Pizza</strong></h2></div><FaArrowCircleRight className='fs-6'/>
            </div>

            <input type="checkbox" id="cart" />
            <label htmlFor="cart" className="label-cart">
                <i className="bi bi-cart3" style={{ color: '#fecb40', fontSize: '25px' }}>
                    {cartItemCount > 0 && <span className="cart-item-count fs-6" style={{ position: 'absolute', top: '0px', color: 'yellow' }}>{cartItemCount}</span>}
                </i>
            </label>
            <div className="toggle-icon" onClick={toggleSidebar}>
                {isSidebarVisible ? (
                    <FaArrowCircleRight className='fs-6'/>
                    // Right arrow icon
                ) : (
                    <FaArrowCircleLeft className='fs-6' /> // Left arrow icon (to show the sidebar again)
                )}
            </div>

            {isSidebarVisible && ( // Sidebar will render conditionally based on state
                <div className="sidebar">
                    <div className="sidebar-menu">
                        <a href="/"><i className="bi bi-search fs-6"></i> Search</a>
                    </div>
                    <div className="sidebar-menu">
                        <a href="/indexpage"><i className="bi bi-house-door-fill fs-6"></i> Home</a>
                    </div>
                    <div className="sidebar-menu">
                        <a href="/signup"><i className="bi bi-person-circle fs-6"></i> Register</a>
                    </div>
                    <div className="sidebar-menu">
                        <a href="/"><i className="bi bi-person-add fs-6"></i> Login</a>
                    </div>
                    <div className="sidebar-menu">
                        <a href='/signup'><i className="bi bi-gear fs-6"></i> Settings</a>
                    </div>
                    <div className="sidebar-menu">
                        <a onClick={{ Logout }} href="/" style={{ border: 'none', background: 'none' }}>
                            <i className="bi bi-box-arrow-right fs-6"></i> Logout
                        </a>
                    </div>
                </div>
            )}
            {/* <div className="sidebar">
                <div className="sidebar-menu">
                    <a href="/"><i className="bi bi-search fs-6"></i>
                    Search</a>
                    
                </div>
                
                <div className="sidebar-menu">
                    <a href="/indexpage"><i className="bi bi-house-door-fill fs-6"></i>
                        Home</a>
                       
                </div>

                <div className="sidebar-menu">
                    <a href="/signup"><i className="bi bi-person-circle fs-6"></i>
                        Register</a>
                        
                </div>
                <div className="sidebar-menu">
                    <a href="/"><i className="bi bi-person-add fs-6"></i>
                        Login</a>
                        
                </div>
                <div className="sidebar-menu">
                    <a href='/signup'><i className="bi bi-gear fs-6"></i>
                        Settings</a>
                       
                </div>

                <div className="sidebar-menu">
                    <a onClick={{Logout}} href="/" style={{border:'none',background:'none'}}><i className="bi bi-box-arrow-right fs-6"></i>Logout</a>
                    
                </div>
            </div> */}
            {/* Dashboard */}
            <div className="dashborad" style={{ backgroundColor: '#fecb40' }}>
                <div className="dashborad-items">
                    <img src={img} alt="#" className="img-fluid" />
                    <div className="dashboard-text">
                        <h1><span>50% OFF</span><br /> Tasty Food <br /> On Your Hand</h1>
                    </div>
                </div>
                <h3 className="dashboard-title">Recommended Food For You</h3>
                <div className="dashboard-menu">
                    <a href='/'>Favorites</a>
                    <a href='/'>Best Seller</a>
                    <a href='/'>Near Me</a>
                    <a href='/'>Promotion</a>
                    <a href='/'>Top Rated</a>
                    <a href='/'>All</a>
                </div>
                <div className="dashboard-content">
                    {
                        Array.isArray(additems) && additems.slice(0, 100).map((product) => (
                            // <div key={a.id}>
                            <div key={product._id} className="dashboard-menus" style={{ backgroundColor: 'black' }}>
                                <img
                                    src={`https://task-backend-v1-fkb7.onrender.com/public/data/uploads/${product.image}`}
                                    // src={`https://task-backend-v1-fkb7.onrender.com/data/uploads/${product.image}`} 
                                    alt="#" className="img-fluid dash-image" style={{ overflow: 'hidden', width: '400px', height: '150px' }} />
                                <div className="details">
                                    <h5 style={{ fontSize: '15px' }}>{product.name}<span>Rs.{product.price}</span></h5>
                                    <p><strong className="box-pizza">BOX PIZZA</strong> {product.description}</p>
                                    <p className="time"><i className="bi bi-clock-fill"></i> 15-20mints</p>
                                    <Button onClick={() => addToCart(product)} className="btn btn-danger">Add Item</Button>
                                    <Button className='fav-item' onClick={() => addToFavorite(product)}>
                                        <i className={favorites.some((item) => item._id === product._id) ? "bi bi-heart-fill fs-3" : "bi bi-heart fs-3"}></i>
                                    </Button>
                                </div>
                            </div>
                            // </div>
                        ))
                    }
                </div>
            </div>
            {/* Order dashboard */}
            <div className="dashboard-order">
                <h3>Order-Menu</h3>
                {/* <div className="order-address">
                    <p>Delivery Address</p>
                    <h5>130 Kalavasal Byepass Road, Madurai-05</h5>
                </div>
                <div className="order-time">
                    <i className="bi bi-clock-fill"></i> 30 mins <i className="bi bi-geo-alt-fill"> 2 km</i>
                </div> */}
                <div className="order-wrapper">
                    {cart.map((cartItem) => (
                        <div key={cartItem._id} className="order-card">
                            <img
                                src={`https://task-backend-v1-fkb7.onrender.com/public/data/uploads/${cartItem.image}`}
                                // src={`https://task-backend-v1-fkb7.onrender.com/data/uploads/${cartItem.image}`}
                                className="order-img" alt="#" />
                            <div className="order-details">
                                <p>{cartItem.name}</p>
                                <div>
                                    <button className="btn btn-danger w-25" onClick={() => decreaseQuantity(cartItem._id)}>-</button>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span>{cartItem.quantity}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <button className="btn btn-danger w-25" onClick={() => increaseQuantity(cartItem._id)}>+</button>
                                </div>
                            </div>
                            <span className="order-price">Rs.{calculateItemTotal(cartItem)}</span>
                        </div>
                    ))}
                </div>
                <hr className="divider" />
                <div className="order-total">
                    <p>Subtotal <span>Rs.{subtotal.toFixed(2)}</span></p>
                    <p>Tax (5%) <span>Rs.{gst}</span></p>
                    <p>Delivery Charges: <span>Rs.{deliveryCharges}</span></p>
                    <div className="promo">
                        <input type="text" className="input-promo" name="floatingInput" id="floatingInput" placeholder="Apply Voucher" />
                        <button className="button-promo">Find Promo</button>
                    </div>
                    <hr className="divider" />
                    <p>Total <span>Rs.{overallTotal}</span></p>
                </div>
                <button className="checkout" onClick={goToCheckoutPage}>Checkout</button>
            </div>
        </div>
    );
};

export default IndexComponent;
