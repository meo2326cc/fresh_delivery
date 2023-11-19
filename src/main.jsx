import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.jsx'
import Admin from './pages/Admin.jsx'
import './pages/scss/all.scss'
import { Login }from './pages/Login.jsx'
import { BrowserRouter , Routes , Route, } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/admin' element={<Admin/>}></Route>
      </Routes>

    </BrowserRouter>
   
  // </React.StrictMode>
)
