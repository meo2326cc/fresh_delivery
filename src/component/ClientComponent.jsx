import { Link } from 'react-router-dom'
import logo from '../img/nav-logo.png'
import logoBig from '../img/footer-logo.png'
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
          <Link className='me-3' to='/'>
            <img src={logo} alt="logo" width="70px" />
          </Link>
          <ul className="d-none d-md-flex list-unstyled" >
            <li className="mx-3"><Link className='btn-link' to='/category/bento'>餐盒</Link></li>
            <li className="mx-3"><Link className='btn-link' to='/category/prepared_food'>各式調理包</Link></li>
            <li className="mx-3"><Link className='btn-link' to='/category/snacks'>點心</Link></li>
          </ul>
        </div>
        <div className="d-flex align-items-center">
          <button type='button' data-bs-target="#cartList" data-bs-toggle="collapse" className='btn btn-link d-flex'><span className="material-icons">shopping_cart</span>  <span className={`bg-danger p-1 d-block  fs-7 ${cartContent.length > 0 ? 'bg-danger text-white' : 'bg-gray-100 text-black'}`}>{cartContent.length}</span> </button>
          
          <button className="btn d-md-none border ms-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
            <span className="material-icons">menu</span>
          </button>
        </div>
      </div>
    </div>
    <div className="sticky-top" style={{top:'74px'}}>
      <div className="container position-relative">
            {/* cart menu */}
            <div className="bg-white collapse position-absolute border w-300px z-index-10000" style={{right:'12px'}} ref={cartListControl} id="cartList" data-bs-auto-close="true">
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
                  <p>{item.product.title.length>8 ?  item.product.title.slice(0,8) + '...' :  item.product.title }</p>
                  <button type='button' className='btn btn-link text-danger p-0 pe-3' onClick={() => { delCartItem(item.id) }}><span className='material-icons-outlined fs-5 align-text-bottom '>delete_forever</span></button>
                </div>
                <p className='text-secondary'> 數量：{item.qty}</p>
              </div>
            </div>)
          })}
        </div>
        {cartContent.length !==0 &&  <Link to='cart' onClick={ ()=>{cartListControl.current.classList.remove('show') } } className='w-100 btn btn-primary mt-2'>前往結帳</Link> }
       
      </div>
    </div>
      </div>
    </div>


    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
      <div className="offcanvas-header">
        {/* <h5 className="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5> */}
        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body ">
        <div>
          <ul className="fs-6 w-100 text-center list-group list-unstyled">
            <li className="text-dark list-group-item-action" data-bs-dismiss="offcanvas"><Link to="/category/bento" className="d-block py-3">餐盒</Link></li>
            <li className="text-dark list-group-item-action" data-bs-dismiss="offcanvas"><Link to="/category/prepared_food" className="d-block py-3">各式調理包</Link></li>
            <li className="text-dark list-group-item-action" data-bs-dismiss="offcanvas"><Link to="/category/snacks" className="d-block py-3">點心</Link></li>

          </ul>
        </div>
      </div>
    </div>
  </>)
}

export function Footer() {
  return (
    <div className="border-top border-primary border-3 position-relative mt-10">
      <div className="container px-3 py-5 flex-wrap flex-md-nowrap d-flex align-items-center justify-content-md-between">
        <div className="d-flex justify-content-between col-12 col-md-4 my-5">
          <div>
            <p className="text-primary mb-3 fs-6 fw-bold">商品分類</p>
            <ul className='list-unstyled'>
              <li><Link to='/category/bento' className='btn-link'>餐盒</Link></li>
              <li><Link to='/category/prepared_food' className='btn-link'>各式調理包</Link></li>
              <li><Link to='/category/snacks' className='btn-link'>點心</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-primary mb-3 fs-6 fw-bold">訂單相關</p>
            <ul className='list-unstyled'>
              <li><Link className='btn-link' to='/searchorder'>訂單查詢</Link></li>
              <li><Link className='btn-link' to='/delivery'>物流配送</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-primary mb-3 fs-6 fw-bold">關於鮮到家</p>
            <ul className='list-unstyled'>
              <li><Link className='btn-link' to='/aboutus'>品牌理念</Link></li>
              <li><Link className='btn-link' to='/privacy'>隱私權政策</Link></li>
            </ul>
          </div>
        </div>

        <div className="d-flex align-items-center my-5">
          <div>
            <img src={logoBig} width="180px" alt="logo" />
          </div>
          <div className="ms-3">
            <h3 className="fs-6">鮮到家食品有限公司</h3>
            <p className="fs-7">電話：02-0000-0000</p>
            <p className="fs-7">聯絡信箱：cccsmp@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageTemplate({children , title}) {
  return(
    <div className="container py-10 view-height">
      <h2>{title}</h2>
        {children}
    </div>
  )
}
