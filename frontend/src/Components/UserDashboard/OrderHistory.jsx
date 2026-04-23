import React, { useEffect, useState } from 'react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      fetch('http://localhost:4000/orders/myorders', {
        method: 'GET',
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrders(data.orders);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="order-history"><p>Loading your orders...</p></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="order-history">
        <h2>Order History</h2>
        <p>You haven't placed any rental orders yet.</p>
      </div>
    );
  }

  return (
    <div className="order-history">
      <h2>Order History</h2>
      {orders.map((order) => (
        <div key={order._id} className="order-card" style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '15px',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor:
                order.orderStatus === 'Returned' ? '#d4edda' :
                order.orderStatus === 'Cancelled' ? '#f8d7da' :
                order.orderStatus === 'Rented' ? '#fff3cd' :
                '#cce5ff',
              color:
                order.orderStatus === 'Returned' ? '#155724' :
                order.orderStatus === 'Cancelled' ? '#721c24' :
                order.orderStatus === 'Rented' ? '#856404' :
                '#004085'
            }}>
              {order.orderStatus}
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '5px' }}>Item</th>
                <th style={{ padding: '5px' }}>Rental Period</th>
                <th style={{ padding: '5px' }}>Qty</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '5px' }}>{item.name || `Product #${item.productId}`}</td>
                  <td style={{ padding: '5px' }}>
                    {new Date(item.startDate).toLocaleDateString()} — {new Date(item.endDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '5px' }}>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '14px', color: '#555' }}>
            <span>Placed: {new Date(order.date).toLocaleDateString()}</span>
            <span>Payment: {order.paymentStatus}</span>
            <strong>Total: Rs. {order.totalAmount}</strong>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
