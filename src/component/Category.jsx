import { useParams , Link , useNavigate } from "react-router-dom";
import { useEffect , useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { success , fail } from "./ToastSlice";
import { update } from "./CartSlice";
import { PageTemplate } from "./ClientComponent";


export default function Category () {

    const { category } = useParams()
    const toIndexPage = useNavigate()
    const [list , setList] = useState([])
    const [title , setTitle] = useState(category)

    useEffect(()=>{
        (async ()=>{
            try{
          const res = await axios.get(import.meta.env.VITE_PATH_CLIENT_PRODUCTS_ALL)
          switch (category) {
              case 'sales' : setList(res.data.products.filter( item =>  item.price !== item.origin_price  ));
                             setTitle('特價專區')
                              break ;
              case 'bento'   : setList(res.data.products.filter( item =>  item.category === '餐盒'));
                             setTitle('餐盒')
                              break ;
              case 'snacks': setList(res.data.products.filter( item =>  item.category === '點心'));
                             setTitle('點心')
                              break ;
              case 'prepared_food': setList(res.data.products.filter( item =>  item.category === '調理包'));
                             setTitle('各式調理包')
              break ;
              default : break ;              
          }                
            }catch(error){
                console.log(error)
            }


        })()
      },[category])

    if(! ['sales' , 'snacks' , 'bento' , 'prepared_food' ].includes(category) ){
        toIndexPage('/*')
    } else {
        return( <PageTemplate title={ title }>
                    <ProductList list={list}/>
                </PageTemplate> )
    }
}


function ProductList ({list}) {
  
    return(<>  
    <div>
      <div className="row g-4">
      {list.length === 0 ?  <ProductListLoading/> : list.map((item , index) => {
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
  
          <div className="">
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