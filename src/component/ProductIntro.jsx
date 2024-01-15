import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useParams , useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { success , fail } from "./ToastSlice"
import { update } from "./CartSlice"
//import { state as notificationState, reducer, NotificationContext } from './ToastStore.jsx'

function Product() {
    const { id } = useParams()
    const pageNotFound = useNavigate()
    const [product, setProduct] = useState()
    const [cartQuantity, setCartQuantity] = useState(1)
    const notificationDispatch = useDispatch()
    const cartDispatch = useDispatch()
    const cartBtn = useRef(null)
    const cartBtnMobile = useRef(null)
    const setBtnDisable = ()=> { 
        cartBtn.current.classList.add('disabled')
        cartBtnMobile.current.classList.add('disabled')
     }
     const setBtnEnable = ()=> { 
        cartBtn.current.classList.remove('disabled')
        cartBtnMobile.current.classList.remove('disabled')
     }

     const cartUpdate = async ()=>{
        try{
            const res = await axios.get(import.meta.env.VITE_PATH_CLIENT_CART)
            cartDispatch(update( res.data.data ))
        }catch{
            notificationDispatch(fail('更新購物車資料失敗'))
        }
     }

    useEffect(() => {
        (async () => {
            try{
            const res = await axios.get(`${import.meta.env.VITE_PATH_CLIENT_PRODUCT}${id}`)
            setProduct(res.data.product)
            }catch{
                pageNotFound('/notfound')
            }

        })()

    }, [id])



    const addToCart = async () => {
        setBtnDisable()
        try {
            await axios.post(import.meta.env.VITE_PATH_CLIENT_CART, {
                data: {
                    "product_id": id,
                    "qty": cartQuantity
                }
            })
            notificationDispatch(success('新增商品至購物車成功' ))
            cartUpdate()
        } catch (error) {
            console.log(error)
            notificationDispatch(fail( '新增商品至購物車失敗' ))
        }finally{
            setBtnEnable()
        }
    }

    return (
        <>
            {product === undefined && <IsLoading/> }
            <div className="container mt-5 view-height">
                <div className="clearfix position-relative">
                    <div className="col-12 d-md-none float-start p-3">
                        <div>
                            <h1 className="fs-3 mb-3">{product?.title}</h1>
                            <div className="border-top border-dark pt-3">
                                {product?.price === product?.origin_price ? <h3 className="fs-4 text-primary">NT $ {product?.price}</h3> :
                                    <div>
                                        <p className="text-gray-600"> <del> NT ${product?.origin_price} </del> </p>
                                        <h3 className="fs-4 text-danger m-0">NT $ {product?.price}</h3>
                                    </div>
                                }

                                <div className="mt-2">
                                    <p>{product?.description}</p>
                                </div>

                                <div className="d-flex justify-content-between flex-wrap mt-10">

                                    <div className="d-flex justify-content-between mb-5">
                                        <p className="d-block py-2">數量（{product?.unit}）</p>
                                        <button type="button" onClick={() => { cartQuantity === 1 ? null : setCartQuantity(prev => prev - 1) }} className=" btn btn-primary w-38px p-0"><p>-</p></button>
                                        <input type="text" value={cartQuantity} className="border-0 w-50px text-center" readOnly />
                                        <button type="button" onClick={() => { setCartQuantity(prev => prev + 1) }} className=" btn btn-primary w-38px p-0"><p>+</p></button>
                                    </div>
                                    <button type="button" ref={cartBtnMobile} onClick={addToCart} className="w-100 btn btn-primary px-5 ">加入購物車</button>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="col-12 col-md-6  float-start p-3">
                        <img src={product?.imageUrl} alt={product?.title} className="w-100 mb-3" />
                        {product?.imagesUrl.map((item, index) => item === '' ? null : <img key={index} src={item} alt={product?.title + '圖片' + index} className="w-100 mb-3" loading="lazy" />)}
                        <p>商品說明：</p>
                        <p>{product?.content}</p>
                    </div>
                    <div className="position-sticky col-12 col-md-6 float-start p-3 d-none d-md-block" style={{ top: '110px' }}>
                        <div>
                            <h1 className="fs-3 mb-3">{product?.title}</h1>
                            <div className="border-top border-dark pt-3">
                                {product?.price === product?.origin_price ? <h3 className="fs-4 text-primary">NT $ {product?.price}</h3> :
                                    <div>
                                        <p className="text-gray-600"> <del> NT ${product?.origin_price} </del> </p>
                                        <h3 className="fs-4 text-danger m-0">NT $ {product?.price}</h3>
                                    </div>
                                }

                                <div className="mt-2">
                                    <p>{product?.description}</p>
                                </div>

                                <div className="d-flex mt-10 flex-wrap justify-content-between">
                                    <div className="d-flex mb-3">
                                        <p className=" py-2 my-2">數量（{product?.unit}）</p>
                                        <button type="button" onClick={() => { cartQuantity === 1 ? null : setCartQuantity(prev => prev - 1) }} className=" btn btn-primary w-38px p-0 my-2"><p>-</p></button>
                                        <input type="text" value={cartQuantity} className="border-0 w-50px text-center my-2" readOnly />
                                        <button type="button" onClick={() => { setCartQuantity(prev => prev + 1) }} className=" btn btn-primary w-38px p-0 my-2"><p>+</p></button>
                                    </div>
                                    <button type="button" ref={cartBtn} onClick={addToCart} className="btn btn-primary px-5 w-100">加入購物車</button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>


            </div>

        </>)

}

function IsLoading(){
    return(<>
    <div className="position-fixed bg-white top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center" style={{zIndex:'1'}}>
        <span className="material-icons pending fs-1">refresh</span>
    </div>
    </>)
}

export default function ProductIntro() {
    return (<Product />)
}


//{
//     "success": true,
//     "product": {
//       "category": "衣服3",
//       "content": "這是內容",
//       "description": "Sit down please 名設計師設計",
//       "id": "-L9tH8jxVb2Ka_DYPwng",
//       "imageUrl": "主圖網址",
//       "imagesUrl": [
//         "圖片網址一",
//         "圖片網址二",
//         "圖片網址三",
//         "圖片網址四",
//         "圖片網址五"
//       ],
//       "is_enabled": 1,
//       "num": 1,
//       "origin_price": 100,
//       "price": 600,
//       "title": "[賣]動物園造型衣服3",
//       "unit": "個"
//     }
//   }