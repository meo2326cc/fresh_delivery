import axios from "axios";
import { useEffect, useReducer, useRef, memo, useCallback, useMemo  } from "react";
import { Modal } from 'bootstrap';
import { useDispatch } from "react-redux";
import { success , fail } from "../ToastSlice";
import FormLoading from "../Pending";
import { useNavigate } from "react-router";
//import { NotificationContext } from "../ToastStore";

export default function Order() {
    const toIndexPage = useNavigate();
    const isLoading = useRef(null)
    const modalController = useRef(null)
    const reducer = (state, action) => {
        switch (action.type) {
            case 'ADDDATA': return { ...state, datas: action.payload, network: true , pending:false }
            case 'NETWORK': return { ...state, network: false , pending:false }
            case 'DETAIL': return { ...state, modalUsage: { type: 'MODAL_DETAIL', cache: action.payload } }
            case 'DEL': return { ...state, modalUsage: { type: 'MODAL_DEL', cache: action.payload } }
            case 'PENDING': return { ...state, pending:true }
            case 'FINISHED': return { ...state, pending:false }
        }
    }
    const [state, dispatch] = useReducer(reducer, { datas: [], pending:false ,network: true, modalUsage: { type: 'MODAL_DEL', cache: null }  })

    console.log('父元件渲染')

    const openOrderModal = function (e) {
        
            dispatch({ type: 'DETAIL', payload: state.datas[Number(e.target.dataset.itemIndex)] })
        
        new Modal(modalController.current).show()
    
    }

    const openDelModal = function (e) {

            dispatch({ type: 'DEL', payload: state.datas[Number(e.target.dataset.itemIndex)] })

        new Modal(modalController.current).show()
        
    }


    const getOrderData = useCallback(async function () {

        isLoading.current.classList.remove('d-none')
        try {
            const res = await axios.get(import.meta.env.VITE_PATH_ADMIN_ORDERS_ALL)
            console.log(res.data)
             dispatch({ type: 'ADDDATA', payload: res.data.orders })

        } catch(err) {
            dispatch({ type: 'NETWORK' })
                        //  路由保護
                if(err.response.status === 401 && err.response.data?.message === "驗證錯誤, 請重新登入" ) {
                    document.cookie = 'hexToken=';
                    toIndexPage('/')
                }

        }finally{
            isLoading.current.classList.add('d-none')
        }
    }, [])

    useEffect(() => {
        getOrderData()
    }, [])

    return (<>
                <div className="container-fluid">
                    <h2 className="mt-3 mb-5">訂單一覽-管理員</h2>
                    {state.network ? 
                    <div className="position-relative">
                       
                         <table className="table table-striped align-middle">
                            <thead className="position-relative">
                                <tr className="border-dark">
                                    <th>#</th>
                                    <th>已付款</th>
                                    <th>總金額</th>
                                    <th>訂單建立日期</th>
                                    <th>訂購人姓名</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <FormLoading isLoading={isLoading}/>
                            <tbody>
                                {
                                    state.datas.map((item, index) => {
                                        return (<tr key={item?.id}>
                                            <th> {index + 1} </th>
                                            <td>{item?.is_paid ? '是' : '否'}</td>
                                            <td>{item?.total}</td>
                                            <td>{ new Date(item?.create_at * 1000).toLocaleDateString() }</td>
                                            <td>{item?.user?.name}</td>
                                            <td>
                                                <button data-item-id={item.id} data-item-index={index} className="btn btn-outline-warning m-1" type="button" onClick={openOrderModal}>詳細</button>
                                                <button data-item-id={item.id} data-item-index={index} className="btn btn-outline-danger m-1" type="button" onClick={openDelModal}>del</button> </td>
                                        </tr>)
                                    })
                                }

                            </tbody>
                        </table>

                    </div>
                        :
                        <div className="alert alert-danger">取得資料發生錯誤</div>}
                        <ModalWindow modalController={modalController} editStatus={state.modalUsage} getData={getOrderData} isLoading={isLoading} />

                </div>
    </>)
}







const ModalWindow = memo(({ modalController, editStatus, getData: getOrderData , isLoading }) => {
    
    const { type, cache } = editStatus

    const notificationDispatch = useDispatch()

    const submitStatus = useRef(null)

    const delProduct = async () => {
        isLoading.current.classList.remove('d-none')
        try {
            await axios.delete(import.meta.env.VITE_PATH_ADMIN_ORDER + cache.id)
            notificationDispatch(success("刪除成功"))
            getOrderData()
        } catch(error) {
            notificationDispatch(fail(`刪除失敗，原因：${error?.message}`))
            isLoading.current.classList.add('d-none')
        }
    }

    const targetModal = useMemo(()=>{

            if (type === 'MODAL_DEL') {
        return (
            <div className="modal fade" ref={modalController} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header bg-primary">
                            <h5 className="modal-title text-white">刪除訂單{cache?.id}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>確定要刪除訂單{cache?.id}嗎？</p>
                            <OrderUserInfo orderInfo={cache}/>

                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={delProduct} className="btn btn-danger px-16" ref={submitStatus} data-bs-dismiss="modal">刪除</button>
                            <button type="button" className="btn btn-secondary px-16" data-bs-dismiss="modal">  取消</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else if (type === 'MODAL_DETAIL') {

        return (
            <div className="modal fade" ref={modalController} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header bg-primary">
                            <h5 className="modal-title text-white">檢視訂單</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <OrderUserInfo orderInfo={cache}/>
                            <OrderList orderInfo={cache}/>
                        </div>
                        <div className="modal-footer">

                            <button type="button" className="btn btn-secondary px-16" data-bs-dismiss="modal">關閉</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    },[type , cache ])

return( targetModal )

}) 



function OrderUserInfo({ orderInfo }){

    return(
        <div className="mt-3 p-5 bg-gray-100 w-100">
        <h2 className="fs-4 mb-3">訂單資訊</h2>
        <p className="py-1">訂單ID：{orderInfo?.id}</p>
        <p className="py-1">姓名：{orderInfo?.user?.name}</p>
        <p className="py-1">電話：{orderInfo?.user?.tel}</p>
        <p className="py-1">電子郵件：{orderInfo?.user?.email}</p>
        <p className="py-1">地址：{orderInfo?.user?.address}</p>
        <p className="py-1">訂單備註：{orderInfo?.message}</p>

    </div>
    )
}



function OrderList ({ orderInfo }) {
    const productArray = Object.values(orderInfo?.products);
  
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
                  <p className="text-secondary"> <span className="d-md-none">x</span> <span className="d-none d-md-inline">數量：</span> {item.qty} </p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="text-secondary">
                    
                    單價：
                    {item?.product.origin_price === item?.product.price ? null : (
                      <span className="me-1">
                       
                        <del> {item?.product.origin_price} </del>
                      </span>
                    )}
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