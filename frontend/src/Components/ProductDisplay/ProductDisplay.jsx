import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState('');
  
  // Rental Date State
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }
    if (!startDate || !endDate || startDate >= endDate) {
      alert("Please select valid rental dates.");
      return;
    }
    
    addToCart(product.id, 1, startDate, endDate);
    alert(`Added ${product.name} to cart for rental from ${startDate.toDateString()} to ${endDate.toDateString()}.`);
  };

  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {[...Array(4)].map((_, idx) => (
            <img key={idx} src={product.image} alt="" />
          ))}
        </div>
        <div className="productdisplay-img">
          <img className='productdisplay-main-img' src={product.image} alt="" />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>

        <div className="productdisplay-right-stars">
          {[...Array(4)].map((_, i) => (
            <img key={i} src={star_icon} alt="star" />
          ))}
          <img src={star_dull_icon} alt="star" />
          <p>(122)</p>
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">Rs. {product.old_price}</div>
          <div className="productdisplay-right-price-new">Rs. {product.new_price} / day</div>
        </div>

        <div className="productdisplay-right-description">
          {product.description || "Elevate your style effortlessly with our premium collection of clothing. Rent it for your special occasion and experience high fashion sustainably!"}
        </div>

        {/* Date Selection Section */}
        <div className="productdisplay-rental-dates">
            <h1>Select Rental Dates</h1>
            <div className="datepicker-container">
                <div>
                    <span>Start:</span>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} minDate={new Date()} />
                </div>
                <div>
                    <span>End:</span>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} minDate={startDate} />
                </div>
            </div>
        </div>

        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {(product.sizes || ["S", "M", "L", "XL", "XXL"]).map((size) => (
              <div
                key={size}
                className={selectedSize === size ? "selected-size" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>RENT NOW</button>

        <p className='productdisplay-right-category'>
          <span>Category:</span> {product.category}
        </p>
        <p className='productdisplay-right-category'>
          <span>Tags:</span> Modern, Latest, Rental
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
