import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './component/Home.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Products from './component/admin/Products.jsx'
import Order from './component/admin/Order.jsx'
import Article from './component/admin/Article.jsx'
import Cart from './component/Cart.jsx'
import Category from './component/Category.jsx'
import ProductIntro from './component/ProductIntro.jsx'
import News from './component/News.jsx'
import FrontLayout from './pages/FrontLayout.jsx'
import SearchOrder from './component/SearchOrder.jsx'
import Delivery from './component/Delivery.jsx'
import AboutUs from './component/AboutUs.jsx'
import Privacy from './component/Privacy.jsx'
import NotFound from './pages/Notfound.jsx'
import './pages/scss/all.scss'
import { Login } from './pages/Login.jsx'
import { HashRouter , Routes , Route } from 'react-router-dom'
import Checkout from './component/checkout.jsx'
import OrderConfirm from './component/OrderConfirm.jsx'


document.title='鮮到家購物網站'
ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path='/' element={<FrontLayout />}>
           <Route path='' element={<Home/>}></Route>
           <Route path={`/product/:id`} element={<ProductIntro/>}></Route>
           <Route path={`/category/:category`} element={<Category/>}></Route>
           <Route path='/news' element={<News/>}></Route>
           <Route path='/login' element={<Login/>}></Route>
           <Route path='/cart' element={<Cart/>}></Route>
           <Route path='/checkout' element={<Checkout/>}></Route>
           <Route path='/orderConfirm/:orderId' element={<OrderConfirm/>}></Route>
           <Route path='/searchorder' element={<SearchOrder/>}></Route>
           <Route path='/delivery' element={<Delivery/>}></Route>
           <Route path='/aboutus' element={<AboutUs/>}></Route>
           <Route path='/privacy' element={<Privacy/>}></Route>
           <Route path='*' element={<NotFound/>}></Route>
        </Route>
        <Route path='/admindashboard' element={<AdminDashboard/>}>
          <Route path='products' element={<Products/>}></Route>
          <Route path='order' element={<Order/>}></Route>
          <Route path='article' element={<Article/>}></Route>
        </Route>
        
      </Routes>
    </HashRouter>
   
   </React.StrictMode>
)
