import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Products from './component/Products.jsx'
import Order from './component/Order.jsx'
import Coupon from './component/Coupon.jsx'
import './pages/scss/all.scss'
import { Login }from './pages/Login.jsx'
import { BrowserRouter , Routes , Route, } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/admindashboard' element={<AdminDashboard/>}>
          <Route path='products' element={<Products/>}></Route>
          <Route path='order' element={<Order/>}></Route>
          <Route path='coupon' element={<Coupon/>}></Route>
        </Route>
      </Routes>

    </BrowserRouter>
   
  // </React.StrictMode>
)
