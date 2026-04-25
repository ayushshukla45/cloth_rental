import React, { useContext, useState } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
    const {
        getTotalCartAmount,
        all_product,
        cartItems,
        removeFromCart,
    } = useContext(ShopContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentError, setPaymentError] = useState('');

    const totalAmount = getTotalCartAmount();

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty. Please add items before proceeding to checkout.');
        } else {
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setConfirmMessage('');
        setPaymentMethod('');
        setPaymentError('');
    };

    const confirmPurchase = () => {
        if (!paymentMethod) {
            setPaymentError('Please select a payment method before confirming.');
            return;
        }

        // Step 1: Place the order
        fetch('http://localhost:4000/orders/placeorder', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'auth-token': `${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                products: cartItems,
                totalAmount: totalAmount
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                // Step 2: Create payment record for the order
                fetch('http://localhost:4000/payments/createpayment', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        orderId: data.orderId,
                        amount: totalAmount,
                        method: paymentMethod
                    }),
                })
                .then((payRes) => payRes.json())
                .then((payData) => {
                    if (payData.success) {
                        setConfirmMessage(`Rental confirmed! Order ID: ${data.orderId}. Transaction: ${payData.transactionId}. Thank you!`);
                    } else {
                        setConfirmMessage(`Order placed! Order ID: ${data.orderId}. Payment pending.`);
                    }
                    setTimeout(() => {
                        closeModal();
                        window.location.reload();
                    }, 3000);
                });
            } else {
                setPaymentError("Error placing order. Please try again.");
            }
        });
    };

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price/Day</p>
                <p>Dates</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />

            {Array.isArray(cartItems) && cartItems.map((item, index) => {
                const product = all_product.find((p) => p.id === Number(item.productId));
                if (!product) return null;
                
                const days = (item.startDate && item.endDate) 
                    ? Math.max(1, Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24)))
                    : 1;

                return (
                    <div key={index}>
                        <div className="cartitems-format cartitems-format-main">
                            <img src={product.image} alt="" className='carticon-product-icon' />
                            <p className="cart-item-name">{product.name}</p>
                            <p>Rs. {product.new_price}</p>
                            <p className="cart-item-dates">
                                {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                <br/>({days} days)
                            </p>
                            <p>Rs. {product.new_price * days * item.quantity}</p>
                            <img
                                className='cartitems-remove-icon'
                                src={remove_icon}
                                onClick={() => removeFromCart(item.productId)}
                                alt=""
                            />
                        </div>
                        <hr />
                    </div>
                );
            })}

            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Sub-total</p>
                            <p>Rs. {totalAmount}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>Rs. {totalAmount}</h3>
                        </div>
                    </div>
                    <button onClick={handleCheckout}>
                        PROCEED TO CHECKOUT
                    </button>
                </div>

                {/* Checkout Modal */}
                {isModalOpen && (
                    <div className="checkout-modal">
                        <div className="checkout-modal-content">
                            <h2>Checkout Summary</h2>
                            <div className="modal-scroll-area">
                                {Array.isArray(cartItems) && cartItems.map((item, idx) => {
                                    const p = all_product.find((product) => product.id === Number(item.productId));
                                    return (
                                        <div key={idx} className="modal-item">
                                            <p>{p ? p.name : "Item"} ({item.quantity})</p>
                                            <p>{new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <h3>Total Payable: Rs. {totalAmount}</h3>

                            <label>
                                Select Payment Method:
                                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <option value="">-- Select --</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Cash on Delivery">Cash on Delivery</option>
                                    <option value="Card">Card</option>
                                </select>
                            </label>
                            {paymentError && <p className="error">{paymentError}</p>}
                            {confirmMessage && <p className="success">{confirmMessage}</p>}

                            <div className="modal-buttons">
                                <button onClick={closeModal} className="cancel-btn">Cancel</button>
                                <button onClick={confirmPurchase} className="confirm-btn">Confirm Rental</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="cartitems-promocode">
                    <p>If you have a promo code, Enter it here</p>
                    <div className="cartitems-promobox">
                        <input type="text" placeholder='promo code' />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;

