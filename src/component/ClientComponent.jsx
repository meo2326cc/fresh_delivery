import { Link } from 'react-router-dom'
import logo from '../img/logo.png'
import { useEffect, useRef } from 'react'
import { useDispatch , useSelector  } from 'react-redux'
import { update } from './CartSlice'
import axios from 'axios'


export function ClientNav() {
  const cartIsLoading = useRef(null)
  const cartListControl = useRef(null)
  const cartDispatch = useDispatch()
  const cartData = useSelector((data) => {
    return data.cartUpdate
  } )
  const { carts:cartContent } = cartData 
  const loading = () => {
    cartIsLoading.current.classList.remove('d-none')
  }
  const loadingOver = () => {
    cartIsLoading.current.classList.add('d-none')
  }


  async function getCartData() {
      try {
        loading()
        const res = await axios.get(import.meta.env.VITE_PATH_CLIENT_CART)
        console.log(res)
        //setCartContent(res.data.data.carts)
        cartDispatch(update( res.data.data ))
        loadingOver()
      } catch (error) {
        console.log(error)
      }
  }

  async function delCartItem(id) {
    loading()
    try {
      await axios.delete(import.meta.env.VITE_PATH_CLIENT_CART + id)
      const res = await axios.get(import.meta.env.VITE_PATH_CLIENT_CART)
      //setCartContent(res.data.data.carts)
      cartDispatch(update( res.data.data ))
    } catch (error) {
      console.log(error)
      
    }finally{
      loadingOver()
    }
  }

useEffect(()=>{
  getCartData()
},[])


  return (<>
    <div className="sticky-top border-1 px-3 py-3 nav navbar-expand-md border d-flex justify-content-between align-items-center bg-white">
      <div className="d-flex align-items-center justify-content-between container">
        <div className="d-flex align-items-center">
          <Link to='/'>
            <img src={logo} alt="logo" width="70px" />
          </Link>
          <ul className="d-none d-md-flex" >
            <li className="mx-3">便當</li>
            <li className="mx-3">調理包</li>
          </ul>
        </div>
        <div className="d-flex align-items-center">
          <button type='button' data-bs-target="#cartList" data-bs-toggle="collapse" className='btn btn-link d-flex'><span className="material-icons">shopping_cart</span>  <span className={`bg-danger p-1 d-block  fs-7 ${cartContent.length > 0 ? 'bg-danger text-white' : 'bg-gray-300 text-black'}`}>{cartContent.length}</span> </button>
          
          <button className="btn d-md-none border ms-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
            <span className="material-icons">menu</span>
          </button>
        </div>
      </div>
    </div>
    <div className="sticky-top" style={{top:'74px'}}>
      <div className="container position-relative">
            {/* cart menu */}
            <div className="bg-white collapse position-absolute border w-300px z-index-10000 end-0" ref={cartListControl} id="cartList" data-bs-auto-close="true">
      <div className="bg-white position-absolute w-100 h-100 d-flex align-items-center justify-content-center" ref={cartIsLoading}>
        <span className="material-icons pending">refresh</span>
      </div>
      <div className="p-2">
        <p className='fs-5 pb-1'>購物車</p>
        <div className='border-top overflow-auto h-200px'>

          {cartContent.length === 0 ? <div className='h-100 w-100 d-flex align-items-center justify-content-center'><p>購物車裡面還沒有商品</p></div> : cartContent.map(item => {
            return (<div className='mt-2 d-flex h-50px' key={item.product_id}>
              <div className='w-25'>
                <div className='w-100 h-50px background-center background-cover' style={{ backgroundImage: `url(${item.product.imageUrl})` }} ></div>
              </div>
              <div className="w-75 ps-2">
                <div className="d-flex justify-content-between align-items-center">
                  <p>{item.product.title}</p>
                  <button type='button' className='btn btn-link text-danger p-0 pe-3' onClick={() => { delCartItem(item.id) }}><span className='material-icons-outlined fs-5 align-text-bottom '>delete_forever</span></button>
                </div>
                <p className='text-secondary'> 數量：{item.qty}</p>
              </div>
            </div>)
          })}

        </div>
        <Link to='cart' onClick={ ()=>{cartListControl.current.classList.remove('show') } } type="button" className='w-100 btn btn-primary mt-2'>前往結帳</Link>
      </div>
    </div>
      </div>
    </div>


    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
      <div className="offcanvas-header">
        {/* <h5 className="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5> */}
        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <div>
          <ul className="fs-6 w-100 text-center list-group">
            <li className="text-dark list-group-item-action" data-bs-dismiss="offcanvas"><Link to="products" className="d-block py-3">產品列表</Link></li>
            <li className="text-dark list-group-item-action" data-bs-dismiss="offcanvas"><Link to="coupon" className="d-block py-3">優惠券列表</Link></li>
            <li className="text-dark list-group-item-action" data-bs-dismiss="offcanvas"><Link to="order" className="d-block py-3">管理訂單</Link></li>

          </ul>
        </div>
      </div>
    </div>
  </>)
}

export function Footer() {
  return (<div className="bg-primary" >
    <div className="container py-10">
      <img src={logo} alt="logo" />
    </div>
  </div>)
}