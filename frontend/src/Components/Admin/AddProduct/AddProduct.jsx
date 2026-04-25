import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../Assets/upload_area.svg'

const AddProduct = () => {

    const[image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        description: "",
        image:"",
        category:"women",
        sizes: ["S", "M", "L", "XL", "XXL"],
        new_price: "",
        old_price:""
    })

    const imageHandler = (e)=>{
        setImage(e.target.files[0]);
    }

    const changeHandler = (e)=>{
        setProductDetails({...productDetails, [e.target.name]:e.target.value})
    }

    const sizeHandler = (size) => {
        setProductDetails((prev) => {
            const sizes = prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];
            return { ...prev, sizes };
        });
    }

    const Add_Product = async()=>{
        console.log(productDetails);
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product', image);

        await fetch('http://localhost:4000/upload',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        }).then((resp)=> resp.json()).then((data)=>{responseData = data});


        if(responseData.success){
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4000/products/addproduct',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("Product added"):alert("Failed")
            })
        }
    }

  return (
    <div className='add-product'>
        <div className="addproduct-itemfield">
            <p>Product Title</p>
            <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder='Type here' />
        </div>

        <div className="addproduct-itemfield">
            <p>Product Description</p>
            <textarea value={productDetails.description} onChange={changeHandler} name="description" placeholder='Write a short description about this cloth...' rows="3" style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit', resize: 'vertical'}} />
        </div>

        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here' />
            </div>
            
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here' />
            </div>
        </div>

        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kids">Kids</option>
            </select>
        </div>

        <div className="addproduct-itemfield">
            <p>Available Sizes</p>
            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <div
                        key={size}
                        onClick={() => sizeHandler(size)}
                        style={{
                            padding: '8px 16px',
                            border: productDetails.sizes.includes(size) ? '2px solid #ff4141' : '1px solid #ccc',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            backgroundColor: productDetails.sizes.includes(size) ? '#fff0f0' : '#fff',
                            fontWeight: productDetails.sizes.includes(size) ? 'bold' : 'normal'
                        }}
                    >
                        {size}
                    </div>
                ))}
            </div>
        </div>

        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img src={image?URL.createObjectURL(image):upload_area} className = 'addproduct-thumbnail-img' alt="" />
            </label>
            <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
        </div>
        <button onClick={()=>{Add_Product()}}className='addproduct-btn'>Add</button>
    </div>
  )
}

export default AddProduct
