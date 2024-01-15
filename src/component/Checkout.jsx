import axios from "axios";
import { useRef } from "react";
import { PageTemplate } from "./ClientComponent";
import { useForm  } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { success , fail } from "./ToastSlice";
import { useNavigate } from "react-router";

export default function Checkout () {

    const { register , handleSubmit , formState:{errors} } = useForm( { mode: 'onBlur' } )
    const submitBtn = useRef()
    const cartContent = useSelector( data => data.cartUpdate )
    const notificationDispatch = useDispatch()
    const gotoOrderConfirm = useNavigate();
    const submitBtnDisable = ()=>{
      submitBtn.current.classList.add('disabled')
    }
    const submitBtnEnable = ()=>{
      submitBtn.current.classList.remove('disabled')
    }

    async function onSubmit(data){
      submitBtnDisable()
        try{
            const res = await axios.post(import.meta.env.VITE_PATH_CLIENT_ORDER , {'data':data} )
            notificationDispatch( success('成功建立訂單！') )
            gotoOrderConfirm(`/orderConfirm/${res.data.orderId}`)
            console.log(res)
        }catch(error){
            notificationDispatch( fail(`訂單建立失敗，原因：${error.message}`) )
        }finally{
          submitBtnEnable()
        }
    }

    return (
      <PageTemplate title="訂單確認">
        <p><span className="text-danger">*</span>為必填欄位</p>
        <div className="row">
          <div className="col-12 col-md-6 order-1 order-md-0">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-3">
                <label htmlFor="name">姓名<span className="text-danger">*</span></label>
                <input
                  className={`form-control ${
                    errors?.user?.name && "is-invalid"
                  }`}
                  type="text"
                  name="name"
                  id="name"
                  {...register("user.name", { required: "姓名為必填欄位" })}
                />
                <div className="invalid-feedback">
                  {errors?.user?.name?.message}
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="email">電子郵件<span className="text-danger">*</span></label>
                <input
                  className={`form-control ${
                    errors?.user?.email && "is-invalid"
                  }`}
                  type="text"
                  name="email"
                  id="email"
                  {...register("user.email", {
                    required: "電子郵件為必填欄位",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "email格式不正確",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors?.user?.email?.message}
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="tel">電話<span className="text-danger">*</span></label>
                <input
                  className={`form-control ${
                    errors?.user?.tel && "is-invalid"
                  }`}
                  type="text"
                  name="tel"
                  id="tel"
                  {...register("user.tel", { required: "電話為必填欄位" })}
                />
                <div className="invalid-feedback">
                  {errors?.user?.tel?.message}
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="address">地址<span className="text-danger">*</span></label>
                <input
                  className={`form-control ${
                    errors?.user?.address && "is-invalid"
                  }`}
                  type="text"
                  name="address"
                  id="address"
                  {...register("user.address", { required: "地址為必填欄位" })}
                />
                <div className="invalid-feedback">
                  {errors?.user?.address?.message}
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="message">訂單備註</label>
                <textarea
                  className="form-control"
                  name="message"
                  id="message"
                  cols="10"
                  rows="5"
                  {...register("message")}
                ></textarea>
              </div>
              <div className="mt-3">
                <button ref={submitBtn} className={`btn btn-primary ${ cartContent.carts.length===0 && 'disabled' }`} type="submit">
                  送出訂單
                </button>
              </div>
            </form>
          </div>
          <div className="col-12 col-md-6 order-0 order-md-1">
                  <OrderConfirm cartContent={cartContent}/>
          </div>
        </div>
      </PageTemplate>
    );
}


function OrderConfirm ( {cartContent} ) {


    return(
        <div className="mt-3 bg-gray-100 p-5">
        <h2 className="fs-4 mb-3">訂單內容</h2>
    {cartContent.carts.length === 0 ? 
      <div className="h-100 w-100 d-flex align-items-center justify-content-start">
        <p>購物車裡面還沒有商品</p>
      </div>
     : 
      <>
      {cartContent.carts.map((item) => {
        return (
          <div className="mt-2 d-flex h-100px" key={item.product_id}>
            <div>
              <div
                className="w-100px h-100px background-center background-cover"
                style={{
                  backgroundImage: `url(${item.product.imageUrl})`,
                }}
              ></div>
            </div>
            <div className="w-100 ps-2">
              <div className="d-flex justify-content-between align-items-center">
                <p className="fw-bold">
                  {item.product.title.length > 8
                    ? item.product.title.slice(0, 8) + "..."
                    : item.product.title}
                </p>
                <p className="text-secondary"> 數量：{item.qty} </p>
              </div>
              <div className="d-flex justify-content-between align-items-center">
              <p className="text-secondary"> 單價：
              {item?.product.origin_price === item?.product.price ? null : <span className="me-1"> <del> {item?.product.origin_price} </del> </span> } { item?.product.price }
              </p>
              <p className="text-secondary"> 小計：{item.final_total}</p>
              </div>
            </div>
          </div>
        );
      }
  
      )
      
      }
              <h3 className="fs-5 mb-0 text-end bg-gray-100 mt-3 pt-3 border-top">
總價： <span className="text-danger fw-bold">{cartContent?.final_total}</span>
</h3>
      </>
      }


  </div>
    )
}



