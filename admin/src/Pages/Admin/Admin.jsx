import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Navbar/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import ManageOrders from '../../Components/ManageOrders/ManageOrders'

const Admin = () => {
  return (
    <div className='admin'>
        <Sidebar/>
        <Routes>
          <Route path = '/addproduct' element={<AddProduct/>}/>
          <Route path = '/listproduct' element={<ListProduct/>}/>
          <Route path = '/manageorders' element={<ManageOrders/>}/>
        </Routes>
    </div>
  )
}

export default Admin
