import axios from "axios";
import { useEffect, useState , useRef } from "react";
import { useSelector , useDispatch } from "react-redux";
import { update } from "./CartSlice";
import { success , fail } from "./ToastSlice";
import FormLoading from "./Pending";

export default function Cart() {
  const cartDispatch = useDispatch()
  const notificationDispatch = useDispatch()
  const cartContent = useSelector((data)=>{
    return data.cartUpdate
  })
  const cartIsLoading = useRef(null)
  const loading = () => {
     cartIsLoading.current.classList.remove('d-none')
  };
  const loadingOver = () => {
     cartIsLoading.current.classList.add('d-none')
  };

  async function getCartData() {
    try {
      loading();
      const res = await axios.get(import.meta.env.VITE_PATH_CLIENT_CART);
      cartDispatch(update(res.data.data));
      loadingOver();
    } catch (error) {
      console.log(error);
    }
  }

  async function delCartItem(id) {
    loading();
    try {
      await axios.delete(import.meta.env.VITE_PATH_CLIENT_CART + id);
    getCartData()
    } catch (error) {
      console.log(error);
    } finally {
      loadingOver();
    }
  }

  async function cartQuantityAdd( id , productId , qty ){
    loading()
    try{
        await axios.put(import.meta.env.VITE_PATH_CLIENT_CART + id  , {
            "data": {
                "product_id": productId ,
                "qty": qty + 1
              }
        })
        notificationDispatch( success ( '操作成功' ))
        getCartData()
    }catch(err){
        notificationDispatch( fail ( '操作失敗' ))
     loadingOver()
    }
  }

  async function cartQuantitySub( id , productId , qty ){
    if(qty > 1){
            loading()
    try{
        await axios.put(import.meta.env.VITE_PATH_CLIENT_CART + id  , {
            "data": {
                "product_id": productId ,
                "qty": qty - 1
              }
        })
        notificationDispatch( success ( '操作成功' ))
        getCartData()
    }catch(err){
        notificationDispatch( fail ( '操作失敗' ))
     loadingOver()
    }
    }

  }

  useEffect(() => {
    getCartData();
  }, []);

  return (
    <div className="container my-10">
      <h1 className="fs-2 mb-0 mb-5">購物車</h1>
      <table className="table position-relative">
        <thead className="position-relative">
          <tr className="border-dark">
            <th>品項</th>
            <th>價錢</th>
            <th className="text-end">刪除</th>
          </tr>
        </thead>
        <FormLoading isLoading={cartIsLoading}/>
        <tbody>
          {cartContent?.carts?.map((item) => {
            return (
              <tr className="" key={item.id}>
                <td>
                  <div className="d-flex">
                    <div className="w-100px h100px">
                    <img
                      src={item?.product.imageUrl}
                      className="w-100px h-100px object-fit"
                    />                        
                    </div>

                    <div className="w-100 ms-2">
                      <h2 className="fs-5">{item?.product.title}</h2>
                        <div className="d-flex justify-content-start align-items-center mw-200px mt-2">
                          <p className="d-block me-2">數量</p>
                          <button
                            type="button" onClick={()=>{cartQuantitySub( item.id , item.product_id , item.qty)}}
                            className=" btn btn-primary w-20px p-0"
                          >
                            <p>-</p>
                          </button>
                          <input
                            type="text"
                            value={item?.qty}
                            className="border-0 w-38px text-center"
                            readOnly
                          />
                          <button
                            type="button" onClick={()=>{cartQuantityAdd( item.id , item.product_id , item.qty)}}
                            className=" btn btn-primary w-20px p-0"
                          >
                            <p>+</p>
                          </button>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <p className="me-2">單價：{item?.product.origin_price === item?.product.price ? null : <span className="me-1"> <del> {item?.product.origin_price} </del> </span> } { item?.product.price } * {item?.qty} </p>
                    <p className="me-2">小計：{item?.final_total}</p>
                  </div>
                </td>
                <td className="text-end">
                    <button type="button" onClick={ ()=>{ delCartItem( item.id ) } } className="btn btn-link pe-0"> <span className="material-icons-outlined text-danger">delete_forever</span> </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className=" px-1 py-2">
        {/* <p>total:{cartContent?.total}</p> */}
        <h3 className="fs-5 mb-0 text-end bg-gray-100 p-3">
          總價： <span className="text-danger fw-bold">{cartContent?.final_total}</span>
        </h3>
      </div>
    </div>
  );
}
