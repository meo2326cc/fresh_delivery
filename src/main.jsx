import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './component/Home.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Products from './component/admin/Products.jsx'
import Order from './component/admin/Order.jsx'
import Cart from './component/Cart.jsx'
import Coupon from './component/admin/Coupon.jsx'
import ProductIntro from './component/ProductIntro.jsx'
import News from './pages/News.jsx'
import FrontLayout from './pages/FrontLayout.jsx'

import './pages/scss/all.scss'
import { Login }from './pages/Login.jsx'
import { BrowserRouter , Routes , Route } from 'react-router-dom'



ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<FrontLayout />}>
           <Route path='' element={<Home/>}></Route>
           <Route path={`/product/:id`} element={<ProductIntro/>}></Route>
           <Route path='/news' element={<News/>}></Route>
           <Route path='/login' element={<Login/>}></Route>
           <Route path='/cart' element={<Cart/>}></Route>
        </Route>
        <Route path='/admindashboard' element={<AdminDashboard/>}>
          <Route path='products' element={<Products/>}></Route>
          <Route path='order' element={<Order/>}></Route>
          <Route path='coupon' element={<Coupon/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
   
   </React.StrictMode>
)
