import React, { useEffect, useState } from 'react'
import './ManageOrders.css'

const ManageOrders = () => {
    const [allOrders, setAllOrders] = useState([]);

    const fetchOrders = async () => {
        await fetch('http://localhost:80/orders/allorders')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setAllOrders(data.orders);
            });
    }

    useEffect(() => {
        fetchOrders();
    }, [])

    const updateStatus = async (orderId, status) => {
        await fetch('http://localhost:80/orders/updateorderstatus', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId, status }),
        }).then((res) => res.json())
        .then((data) => {
            if (data.success) {
                alert("Status Updated");
                fetchOrders();
            }
        });
    }

    return (
        <div className='manage-orders'>
            <h1>All Rental Bookings</h1>
            <div className="orders-container">
                <div className="orders-format-main">
                    <p>Order ID</p>
                    <p>User</p>
                    <p>Products</p>
                    <p>Total</p>
                    <p>Status</p>
                    <p>Action</p>
                </div>
                <hr />
                {allOrders.map((order, index) => {
                    return (
                        <div key={index}>
                            <div className="orders-format-main orders-format">
                                <p>{order._id.slice(-6)}</p>
                                <p>{order.userId?.name || 'Guest'}<br/>{order.userId?.email}</p>
                                <div className="order-products-list">
                                    {order.products.map((p, i) => (
                                        <p key={i}>{p.name} ({p.quantity})</p>
                                    ))}
                                </div>
                                <p>Rs. {order.totalAmount}</p>
                                <p className={`status-${order.orderStatus.toLowerCase().replace(/ /g, '-')}`}>
                                    {order.orderStatus}
                                </p>
                                <div className="order-actions">
                                    <select 
                                        value={order.orderStatus} 
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                    >
                                        <option value="Booked">Booked</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Rented">Rented</option>
                                        <option value="Returned">Returned</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <hr />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ManageOrders;
