import React from 'react';
import { Button } from 'react-bootstrap';

const AllItemsList = ({ additems, addToCart, addToFavorite, favorites }) => {
    return (
        <div className="dashboard-content">
            {Array.isArray(additems) && additems.slice(0, 100).map((product) => (
                <div key={product._id} className="dashboard-menus" style={{ backgroundColor: 'black' }}>
                    <img
                        src={`https://task-backend-v1-fkb7.onrender.com/public/data/uploads/${product.image}`}
                        alt="#" className="img-fluid dash-image" style={{ overflow: 'hidden', width: '400px', height: '150px' }} 
                    />
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
            ))}
        </div>
    );
};

export default AllItemsList;
