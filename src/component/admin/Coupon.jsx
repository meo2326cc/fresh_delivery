import axios from "axios";
import { useEffect, useReducer, useRef, memo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Modal } from 'bootstrap';
import Pending from "../Pending";

export default function Coupon() {
    //const toIndexPage = useNavigate();
    const modalController = useRef(null)
    const reducer = (state, action) => {
        switch (action.type) {
            case 'ADDDATA': return { ...state, datas: action.payload, network: true }
            case 'NETWORK': return { ...state, network: false }
            case 'ADD': return { ...state, modalUsage: { type: '新增品項', cache: null } }
            case 'EDIT': return { ...state, modalUsage: { type: '修改品項', cache: action.payload } }
            case 'DEL': return { ...state, modalUsage: { type: '刪除', cache: action.payload } }
            case 'PENDING': return { ...state, pending:true }
            case 'FINISHED': return { ...state, pending:false }


        }
    }
    const [state, dispatch] = useReducer(reducer, { datas: [], pending:false , network: true, modalUsage: { type: '新增品項', cache: null } })

    const openEditModal = function (e) {
        if (!(e.target.dataset.itemId == state.modalUsage.cache?.id && state.modalUsage.type === '修改品項')) {
            dispatch({ type: 'EDIT', payload: state.datas[Number(e.target.dataset.itemIndex)] })
        }
        new Modal(modalController.current).show()
    }

    const openDelModal = function (e) {
        if (!(e.target.dataset.itemId == state.modalUsage.cache?.id && state.modalUsage.type === '刪除')) {
            dispatch({ type: 'DEL', payload: state.datas[Number(e.target.dataset.itemIndex)] })
        }
        new Modal(modalController.current).show()
    }

    const openAddModal = function () {
        if (state.modalUsage.type !== '新增品項') {
            dispatch({ type: 'ADD' })
        }
        new Modal(modalController.current).show()
    }

    const getData = useCallback(async function () {
        dispatch({type:'PENDING'})
        try {
            const res = await axios.get(import.meta.env.VITE_PATH_ADMIN_COUPONS_ALL)
            dispatch({ type: 'ADDDATA', payload: res.data.coupons })
            dispatch({type:'FINISHED'})
        } catch (err) {
            console.log(err)
            dispatch({type:'FINISHED'})
            dispatch({ type: 'NETWORK' })
        }
    }, [])



    useEffect(() => {
        getData()
    }, [])

    return (<>

                <div className="container-fluid">
                    <h2 className="mt-3 mb-5">優惠券列表-管理員</h2>
                    <button type="button" className="btn btn-primary mb-3" onClick={openAddModal}>新增優惠券</button>
                    {state.network ?
                    <div className="position-relative">
                         
                        <table className="table table-striped align-middle">
                            <thead>
                                <tr className="border-dark">
                                    <th>#</th>
                                    <th>title</th>
                                    <th>code</th>
                                    <th>due_date</th>
                                    <th>啟用</th>
                                    <th>percent</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            {state.pending && <Pending/>} 
                            <tbody>
                                {
                                    state.datas.map((item, index) => {
                                        return (<tr key={index}>
                                            <th> {index + 1} </th>
                                            <td>{item.title}</td>
                                            <td>{item.code}</td>
                                            <td>{item.due_date}</td>
                                            <td>{item?.is_enable ? '是' : '否'}</td>
                                            <td>{item.percent}</td>
                                            <td>
                                                <button data-item-id={item.id} data-item-index={index} className="btn btn-outline-warning m-1" type="button" onClick={openEditModal}>修改</button>
                                                <button data-item-id={item.id} data-item-index={index} className="btn btn-outline-danger m-1" type="button" onClick={openDelModal}>刪除</button> </td>
                                        </tr>)
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                        :
                        <div className="alert alert-danger">取得資料發生錯誤</div>}
                    <ModalWindow modalController={modalController} editStatus={state.modalUsage} getData={getData} />
                </div>
    </>)
}


const ModalWindow = memo(({ modalController, editStatus, getData }) => {

    const { type, cache } = editStatus

    const {
        register,
        handleSubmit,
        setValue
    } = useForm()


    useEffect(() => {
        setValue('title', cache?.title)
        setValue('category', cache?.category)
        setValue('content', cache?.content)
        setValue('price', cache?.price)
        setValue('origin_price', cache?.origin_price)
        setValue('unit', cache?.unit)
        setValue('description', cache?.description)
        setValue('is_enable', cache?.is_enable)
    }, [cache])


    const delProduct = async () => {
        try {
            await axios.delete(import.meta.env.VITE_PATH_ADMIN_COUPON + cache.id)
            getData()
        } catch (error) {
            console.log(error)
        }
    }

    const editProduct = async function (data) {
        try {
            await axios.put(import.meta.env.VITE_PATH_ADMIN_COUPON + cache.id, { "data": { ...data, price: Number(data.price), origin_price: Number(data.price) } })
            getData()

        } catch (error) {
            console.log(error)
        }

    }
    const addData = async function (data) {
        try {
            const res = await axios.post(import.meta.env.VITE_PATH_ADMIN_PRODUCT, { "data": { ...data, price: Number(data.price), origin_price: Number(data.price) } })
            console.log(res)

            getData()

        } catch (error) {
            console.log(error)
        }
    }

    const onSubmit = function (data) {
        switch (type) {
            case '新增品項': addData(data)
                break;
            case '修改品項': editProduct(data)
                break
        }

    }

    if (type === '刪除') {
        return (
            <div className="modal fade" ref={modalController} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">刪除優惠券：{cache.title}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>確定要刪除優惠券：{cache.title}嗎？</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={delProduct} className="btn btn-danger px-16" data-bs-dismiss="modal">刪除</button>
                            <button type="button" className="btn btn-secondary px-16" data-bs-dismiss="modal">  取消</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else if (type !== '刪除') {
        return (
            <div className="modal fade" ref={modalController} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{cache ? '修改品項' : '新增品項'}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmit)} >
                                <div className="mb-1">
                                    <label htmlFor="title">標題</label>
                                    <input className="form-control" type="text" id="title" name="title" {...register("title", { required: true })} />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="category">類別</label>
                                    <input className="form-control" type="text" id="category" name="category" {...register("category", { required: true })} />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="origin_price">原價</label>
                                    <input className="form-control" type="number" id="origin_price" name="origin_price" {...register("origin_price")} />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="price">售價</label>
                                    <input className="form-control" type="number" id="price" name="price" {...register("price")} />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="unit">單位</label>
                                    <input className="form-control" type="text" id="unit" name="unit" {...register("unit", { required: true })} />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="content">內容</label>
                                    <input className="form-control" type="text" id="content" name="content" {...register("content")} />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="description">描述</label>
                                    <textarea className="form-control" type="textarea" id="description" name="description" {...register("description")} />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="is_enable">啟用</label>
                                    <input type="checkbox" id="is_enable" name="is_enable" {...register("is_enable")} />
                                </div>
                                <input className="btn btn-primary" data-bs-dismiss="modal" type="submit" />
                            </form>

                        </div>
                        <div className="modal-footer">

                            <button type="button" className="btn btn-secondary px-16" data-bs-dismiss="modal">關閉</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


}) 
