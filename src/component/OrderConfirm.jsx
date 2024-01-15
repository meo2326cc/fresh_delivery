import { useParams } from "react-router";
import { PageTemplate } from "./ClientComponent";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { success , fail } from "./ToastSlice";
import axios from "axios";

export default function OrderConfirm() {
  const { orderId } = useParams();
  const [orderInfo, setOrderInfo] = useState();
  const [loading, isLoading] = useState({loading:false , event:'載入中'});
  const notificationDispatch = useDispatch()

  async function getOrderInfo() {
    isLoading({ event:'載入中' , loading :true})
    try {
      const res = await axios.get(
        import.meta.env.VITE_PATH_CLIENT_ORDER + orderId
      );
      console.log(res.data);
      setOrderInfo(res.data.order);

        if (res.data.order === null) {
          null;
        }

    } catch {
      null;
    }finally{
        isLoading({...loading , loading: false})
    }
  }

  async function handelPayment(){
    isLoading({ event:'付款處理中' , loading:true})
    try{
        await axios.post(import.meta.env.VITE_PATH_CLIENT_PAY + orderId )
        notificationDispatch( success('付款成功'))
        getOrderInfo()
    }catch(error){
        notificationDispatch( fail(`付款失敗，原因${error.message}`) )
    }finally{
    isLoading({...loading , loading:false})
    }
  }

  useEffect(() => {
    getOrderInfo();
  }, []);

  if (orderInfo === null ){
    return( <OrderNotFound orderId={orderId}/> )
  }else{
     return (<ShowOrder orderId={orderId} orderInfo={orderInfo} loading={loading} handelPayment={handelPayment} />)
  }
 
}

function ShowOrder ({orderId , orderInfo , loading , handelPayment}) {

  return( 
        <PageTemplate title={"訂單已建立"}>
      <h3 className="fs-5">訂單編號：{orderId}</h3>
      <h4 className="fs-5">
        付款狀態：{orderInfo?.is_paid ? "已付款，訂單將盡快出貨" : "未付款"}
      </h4>
      <div className="row mt-5 g-0 position-relative">
        { loading.loading && <LoadingPage event={loading.event}/> }
        <div className="col-md-6 col-12 align-self-stretch d-flex flex-1">
          <div className="mt-3 p-5 bg-gray-100 w-100">
            <h2 className="fs-4 mb-3">訂購人資訊</h2>
            <p className="py-1">姓名：{orderInfo?.user?.name}</p>
            <p className="py-1">電話：{orderInfo?.user?.tel}</p>
            <p className="py-1">電子郵件：{orderInfo?.user?.email}</p>
            <p className="py-1">地址：{orderInfo?.user?.address}</p>
            <p className="py-1">訂單備註：{orderInfo?.message}</p>
          </div>
        </div>
        <div className="col-md-6 col-12 align-self-stretch d-flex flex-1">
          {orderInfo !== undefined && <Order orderInfo={orderInfo} />}
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12">
            <button onClick={handelPayment} className={`btn btn-primary d-block ms-auto w-auto ${orderInfo?.is_paid && 'disabled'} ${loading.loading && 'disabled'}` }> {orderInfo?.is_paid ? '謝謝，已付款' : '按此進行付款'} </button>            
        </div>
      </div>
    </PageTemplate>
   )

}

function Order({ orderInfo }) {
  const productArray = Object.values(orderInfo.products);

  return (
    <div className="mt-3 p-5 bg-gray-100 w-100">
      <h2 className="fs-4 mb-3">訂單內容</h2>

      {productArray.map((item) => {
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
                <p className="text-secondary">
                  {" "}
                  單價：
                  {item?.product.origin_price === item?.product.price ? null : (
                    <span className="me-1">
                      {" "}
                      <del> {item?.product.origin_price} </del>{" "}
                    </span>
                  )}{" "}
                  {item?.product.price}
                </p>
                <p className="text-secondary"> 小計：{item.final_total}</p>
              </div>
            </div>
          </div>
        );
      })}
      <h3 className="fs-5 mb-0 text-end bg-gray-100 mt-3 pt-3 border-top">
        總價： <span className="text-danger fw-bold">{orderInfo?.total}</span>
      </h3>
    </div>
  );
}

function LoadingPage ({event}) {
    return( <div className="col-12 flex-column position-absolute opacity-background-gray h-100 d-flex justify-content-center align-items-center">
      <span className="material-icons pending">refresh</span>
      <p>{event}</p>
    </div> )
  }

  function OrderNotFound({orderId}){
    return (<div className="container d-flex justify-content-center align-items-center flex-column align-items-center view-height">
        <h2 className="flex-1">抱歉，您欲查詢的訂單 {orderId} 不存在</h2>
        <p>請再次檢查是否填寫正確</p>
    </div>)
}