import axios from "axios"
import {  useEffect , useState  } from "react";
import { useDispatch } from "react-redux";
import { success , fail } from "./ToastSlice";
import { update } from "./CartSlice";
import bannerImg from '../img/banner1.webp'
import imG from '../img/pic.webp'
import { Link } from "react-router-dom"
//import{ state as notificationState , reducer ,  NotificationContext }from './ToastStore'



function Banner(){

  // const slideshowContainer = useRef(null)
  // let w = 1032 ; 

  // useEffect(()=>{
  //   //slideshowContainer.current
  //   w = (document.getElementById('abxd').offsetWidth) * 2;
  //   console.log(w)
  // },[])

  return(
    // <div className="container py-5">
    //   {/* <div className="banner mt-5 py-5" style={{backgroundImage:`url(${bannerImg})`}}></div> */}
    //   <div className=" banner overflow-auto" id='abxd'>
    //     <div className="">
    //     <div className="slideChild d-inline-block position-relative"><img src={bannerImg} className=" mw-100" alt="" /></div>
    //     <div className="slideChild d-inline-block position-relative"><img src={imG} className=" mw-100" alt="" /></div>          
    //     </div>
    //   </div>
    // </div>

    <div id="carouselExampleControls" className="mt-10 carousel slide container banner overflow-hidden" data-bs-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src={bannerImg} className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src={imG} className="d-block w-100" alt="..."/>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
  )
}

function EventPages(){
  return(
    <div className="container mt-4">
      <div className="row gy-10">
        <div className="col-12 col-md-6">
          <Link to='/news'>
            <div className="transition-slide-parent h-200px background-cover background-center overflow-hidden" style={{ backgroundImage: 'url(https://picsum.photos/600/300)' }}>
              <div className="transition-slide h-200px opacity-background-primary position-relative d-flex justify-content-center align-items-center">
                <h3 className="text-white fs-3">最新消息</h3>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-12 col-md-6">
          <Link>
            <div className="transition-slide-parent h-200px background-cover background-center overflow-hidden" style={{ backgroundImage: 'url(https://picsum.photos/600/300)' }}>
              <div className="transition-slide h-200px opacity-background-primary position-relative d-flex justify-content-center align-items-center">
                <h3 className="text-white fs-3">最新消息</h3>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProductList () {


  const [list , setList] = useState([])


  useEffect(()=>{
    (async ()=>{
      const res = await axios.get(import.meta.env.VITE_PATH_CLIENT_PRODUCTS_ALL)
      setList( res.data?.products )
    })()
  },[])

  return(<>
  <div className="container ">
    <div className="border-top border-1 mt-20 border-dark text-center">
  <h3 className=" bg-white d-inline-block m-auto position-relative px-3 top--16">所有商品</h3>  
    </div>
  </div>

  <div className=" container ">
    <div className="row gy-3">
    {list.at(0)===undefined?  <ProductListLoading/> : list.map((item , index) => {
      return <Card item={item} key={index}/>
    })}        
    </div>
  
  </div>


  </>)
}

function ProductListLoading() {
    return( <div className="col-12 h-300px d-flex justify-content-center align-items-center">
      <span className="material-icons pending">refresh</span>
    </div> )
  }

function Card ({item:{  title , imageUrl , id , price , origin_price}}) {

  const notificationDispatch = useDispatch()

  const cartDispatch = useDispatch()

  const btnDisable = ()=>{
    document.querySelectorAll('#addBtn').forEach(el => el.classList.add('disabled'))
  }

  const btnEnable = ()=>{
    document.querySelectorAll('#addBtn').forEach(el => el.classList.remove('disabled'))
  }

  const cartUpdate = async ()=>{
    try{
        const res = await axios.get(import.meta.env.VITE_PATH_CLIENT_CART)
        cartDispatch(update( res.data.data ))
    }catch{
        notificationDispatch(fail('更新購物車資料失敗'))
    }
 }


  const addToCart = async()=>{
    btnDisable()
    try{
    await axios.post(import.meta.env.VITE_PATH_CLIENT_CART, { data:{ 
      "product_id": id ,
      "qty": 1
     } })
     notificationDispatch( success( '新增商品至購物車成功' ) )
     cartUpdate()
    }catch(error){
      //console.log(error)
      notificationDispatch( fail( '新增商品至購物車失敗' ))
    }finally{
      btnEnable()
    }
  }

  return(
    <div className="col-6 col-lg-4">

      <Link to={`/Product/${id}`} className="transition-zoom" onClick={(e) => { e.target.innerHTML === '加入購物車' ? e.preventDefault() : null }}>

        <div className="p-3">
          {origin_price !== price && <span className="bg-danger text-white position-absolute px-2 py-1" style={{zIndex:'1'}}>SALE</span>}
          <div className="bg-gray-200 w100 h200px">
            <div className="w-100 object-fit position-relative" style={{ backgroundImage: `url(${imageUrl})`, height: `200px `, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <button type="button" id="addBtn" onClick={addToCart} className="btn btn-primary w-100 position-absolute bottom-0 text-white" >加入購物車</button>
            </div>
          </div>
          <h2 className="fs-5 mt-2 ">{title}</h2>
          {origin_price === price ? <p className="fs-5">NT $ {price}</p> : <p className="fs-5 text-danger fw-bold"><span className="fs-6 ms-1 text-gray-600 fw-normal"><del>NT $ {origin_price}</del></span> NT ${price}  </p>}

        </div>
      </Link>
    </div>

)

}

function Home() {
  
  //const NotificationReducer = useReducer( reducer , notificationState )

  return (
<>
      <Banner/>
      <EventPages/>
      <ProductList/>
      <Link to='/login'>登入</Link>
</>
  )
}

export default Home
