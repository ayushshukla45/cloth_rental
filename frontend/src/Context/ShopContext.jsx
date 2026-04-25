import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState([]); // Now an array of objects

    const API_BASE_URL = "http://localhost:4000"; // Updated to match backend port

    useEffect(() => {
        fetch(`${API_BASE_URL}/products/allproducts`)
            .then((response) => response.json())
            .then((data) => setAll_Product(data));

        if (localStorage.getItem('auth-token')) {
            fetch(`${API_BASE_URL}/users/getcart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: "",
            }).then((response) => response.json())
            .then((data) => setCartItems(Array.isArray(data) ? data : []));
        }
    }, []);

    const addToCart = (productId, quantity = 1, startDate = null, endDate = null) => {
        const newItem = { productId, quantity, startDate, endDate };
        
        setCartItems((prev) => {
            // Safety check: if prev is not an array (legacy data), reset it to an empty array
            const currentCart = Array.isArray(prev) ? prev : [];
            
            const existingIndex = currentCart.findIndex(item => item.productId === productId && item.startDate === startDate && item.endDate === endDate);
            if (existingIndex > -1) {
                const updated = [...currentCart];
                updated[existingIndex].quantity += quantity;
                return updated;
            }
            return [...currentCart, newItem];
        });

        if (localStorage.getItem('auth-token')) {
            fetch(`${API_BASE_URL}/users/addtocart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "itemId": productId, quantity, startDate, endDate }),
            })
            .then((response) => response.json())
            .then((data) => console.log(data));
        }
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => {
            const currentCart = Array.isArray(prev) ? prev : [];
            return currentCart.filter(item => item.productId !== productId);
        });

        if (localStorage.getItem('auth-token')) {
            fetch(`${API_BASE_URL}/users/removefromcart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "itemId": productId }),
            })
            .then((response) => response.json())
            .then((data) => console.log(data));
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        if (!Array.isArray(cartItems)) return 0;
        cartItems.forEach((item) => {
            let itemInfo = all_product.find((product) => product.id === Number(item.productId));
            if (itemInfo) {
                // If pricePerDay exists, calculate based on days
                const days = (item.startDate && item.endDate) 
                    ? Math.max(1, Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24)))
                    : 1;
                const dailyRate = itemInfo.pricePerDay || itemInfo.new_price || 0;
                totalAmount += dailyRate * days * item.quantity;
            }
        });
        return totalAmount;
    };

    const getTotalCartItems = () => {
        if (!Array.isArray(cartItems)) return 0;
        return cartItems.reduce((acc, item) => acc + item.quantity, 0);
    };

    const contextValue = { getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart };
    
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;