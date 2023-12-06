import axios from "axios";
import { useEffect, useReducer, useRef, memo, useCallback  } from "react";
import { useForm } from "react-hook-form";
import { Modal } from 'bootstrap';
import { useDispatch } from "react-redux";
import { success , fail } from "../ToastSlice";
//import { NotificationContext } from "../ToastStore";

export default function Products() {
    //const toIndexPage = useNavigate();
    const isLoading = useRef(null)
    const modalController = useRef(null)
    const reducer = (state, action) => {
        switch (action.type) {
            case 'ADDDATA': return { ...state, datas: action.payload, network: true , pending:false }
            case 'NETWORK': return { ...state, network: false , pending:false }
            case 'ADD': return { ...state, modalUsage: { type: '新增品項', cache: null } }
            case 'EDIT': return { ...state, modalUsage: { type: '修改品項', cache: action.payload } }
            case 'DEL': return { ...state, modalUsage: { type: '刪除', cache: action.payload } }
            case 'PENDING': return { ...state, pending:true }
            case 'FINISHED': return { ...state, pending:false }
        }
    }
    const [state, dispatch] = useReducer(reducer, { datas: [], pending:false ,network: true, modalUsage: { type: '新增品項', cache: null }  })

    console.log('父元件渲染')

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

        isLoading.current.classList.remove('d-none')
        try {
            const res = await axios.get(import.meta.env.VITE_PATH_ADMIN_PRODUCTS_ALL)
            const handleData = Object.values(res.data.products);
            handleData.shift()
            dispatch({ type: 'ADDDATA', payload: handleData })

        } catch {
            dispatch({ type: 'NETWORK' })
        }finally{
            isLoading.current.classList.add('d-none')
        }
    }, [])

    useEffect(() => {
        getData()
    }, [])

    return (<>
                <div className="container-fluid">
                    <h2 className="mt-3 mb-5">產品列表-管理員</h2>
                    <button type="button" className="btn btn-primary mb-3" onClick={openAddModal}>新增品項</button>
                    {state.network ? 
                    <div className="position-relative">
                       
                         <table className="table table-striped align-middle">
                            <thead className="position-relative">
                                <tr className="border-dark">
                                    <th>#</th>
                                    <th>title</th>
                                    <th>category</th>
                                    <th>price</th>
                                    <th>啟用</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <FormLoading isLoading={isLoading}/>
                            <tbody>
                                {
                                    state.datas.map((item, index) => {
                                        return (<tr key={item?.id}>
                                            <th> {index + 1} </th>
                                            <td>{item?.title}</td>
                                            <td>{item?.category}</td>
                                            <td>{item?.price}</td>
                                            <td>{item?.is_enabled ? '是' : '否'}</td>
                                            <td>
                                                <button data-item-id={item.id} data-item-index={index} className="btn btn-outline-warning m-1" type="button" onClick={openEditModal}>edit</button>
                                                <button data-item-id={item.id} data-item-index={index} className="btn btn-outline-danger m-1" type="button" onClick={openDelModal}>del</button> </td>
                                                 {/* {<span className="material-icons">edit</span>} */}
                                                 {/* {<span className="material-icons">delete</span>} */}
                                        </tr>)
                                    })
                                }

                            </tbody>
                        </table>

                    </div>
                        :
                        <div className="alert alert-danger">取得資料發生錯誤</div>}
                        <ModalWindow modalController={modalController} editStatus={state.modalUsage} getData={getData} isLoading={isLoading} />

                </div>
    </>)
}


const ModalWindow = memo(({ modalController, editStatus, getData , isLoading }) => {
    
    console.log('render_this_form')

    const { type, cache } = editStatus

    const notificationDispatch = useDispatch()

    const submitStatus = useRef(null)

    //console.log(cache)

    const {
        register,
        handleSubmit,
        reset,
        getFieldState,
        formState:{errors}
    } = useForm({mode:'onBlur'})
    
    
    useEffect(() => {
        reset()
        reset({
            title: cache?.title,
            category: cache?.category,
            content: cache?.content,
            price: cache?.price,
            origin_price: cache?.origin_price,
            unit: cache?.unit,
            description: cache?.description,
            is_enabled: cache?.is_enabled,
            imageUrl: cache?.imageUrl,
            imagesUrl:[cache?.imagesUrl[0],
                       cache?.imagesUrl[1],
                       cache?.imagesUrl[2],
                       cache?.imagesUrl[3],
                       cache?.imagesUrl[4]
                      ]


        },{keepErrors:false, keepDirtyValues:true , keepDefaultValues:true})

        cache === null ?  submitStatus.current.setAttribute('data-bs-dismiss' , 'false') : submitStatus.current.setAttribute('data-bs-dismiss' , 'modal');
    
    }, [cache])

    const delProduct = async () => {
        isLoading.current.classList.remove('d-none')
        try {
            await axios.delete(import.meta.env.VITE_PATH_ADMIN_PRODUCT + cache.id)
            notificationDispatch(success("刪除成功"))
            getData()
        } catch(error) {
            notificationDispatch(fail(`刪除失敗，原因：${error?.message}`))
            isLoading.current.classList.add('d-none')
        }
    }

    const editProduct = async function (data) {
        isLoading.current.classList.remove('d-none')
        try {
            //await axios.put(import.meta.env.VITE_PATH_ADMIN_PRODUCT + cache.id, { "data": { ...data, price: Number(data.price), origin_price: Number(data.origin_price) } })
            console.log(data)
            await axios.put(import.meta.env.VITE_PATH_ADMIN_PRODUCT + cache.id , { "data": { ...data , is_enabled: data.is_enabled ? 1 : 0  }})
            notificationDispatch(success("編輯成功"))
            getData()

        } catch(error) {
            console.log(error)
            notificationDispatch(fail(`編輯失敗，原因：${error?.message}`))
            isLoading.current.classList.add('d-none')
        }

    }
    const addData = async function (data) {
        isLoading.current.classList.remove('d-none')
        try {
            await axios.post(import.meta.env.VITE_PATH_ADMIN_PRODUCT, { "data": { ...data , is_enabled: data.is_enabled ? 1 : 0  } })
            notificationDispatch(success({type:'SUCCESS', message:"新增成功"}))
            getData()
        } catch (error) {
            notificationDispatch(fail(`新增失敗，原因：${error?.message}`))
            isLoading.current.classList.add('d-none')
        }

    }

    const onSubmit = function (data) {
        console.log(data)
        switch (type) {
            case '新增品項': addData(data)
                break;
            case '修改品項': editProduct(data)
                break;
        }

    }

    if (type === '刪除') {
        return (
            <div className="modal fade" ref={modalController} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header bg-primary">
                            <h5 className="modal-title text-white">刪除{cache.title}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>確定要刪除{cache.title}嗎？</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={delProduct} className="btn btn-danger px-16" ref={submitStatus} data-bs-dismiss="modal">刪除</button>
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
                        <div className="modal-header bg-primary">
                            <h5 className="modal-title text-white">{cache ? '修改品項' : '新增品項'}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmit)} >
                                <div className="mb-1">
                                    <label htmlFor="title">標題</label>
                                    <input className={`form-control ${ errors.title && 'is-invalid' }`} type="text" id="title" name="title" {...register("title", { required: true })} />
                                    <div className="invalid-feedback">請輸入標題</div>
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="category">類別</label>
                                    <input className={`form-control ${ errors.category && 'is-invalid' }`} type="text" id="category" name="category" {...register("category", { required: true })} />
                                    <div className="invalid-feedback">請輸入類別</div>
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="origin_price">原價</label>
                                    <input className="form-control" type="number" id="origin_price" name="origin_price" {...register("origin_price" , {valueAsNumber:true})} />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="price">售價</label>
                                    <input className="form-control" type="number" id="price" name="price" {...register("price", {valueAsNumber: true})} />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="unit">單位</label>
                                    <input className={`form-control ${ errors.unit && 'is-invalid' }`} type="text" id="unit" name="unit" {...register("unit", { required: true })} />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="description">描述</label>
                                    <textarea className="form-control" type="textarea" id="description" name="description" {...register("description")} />
                                </div>                                
                                <div className="mb-1">
                                    <label htmlFor="content">詳細內容</label>
                                    <textarea className="form-control" type="textarea" id="content" name="content" {...register("content")} />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="imageUrl">主圖網址</label>
                                    <input className="form-control" type="url" id="imageUrl" name="imageUrl" {...register("imageUrl")} />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="imagesUrl">附加圖片網址</label>
                                    <input className="form-control" type="url"   {...register("imagesUrl.0")} />
                                    <input className="form-control" type="url"   {...register("imagesUrl.1")} />
                                    <input className="form-control" type="url"   {...register("imagesUrl.2")} />
                                    <input className="form-control" type="url"   {...register("imagesUrl.3")} />
                                    <input className="form-control" type="url"   {...register("imagesUrl.4")} />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="is_enabled">啟用</label>
                                    <input type="checkbox" id="is_enabled" name="is_enabled" {...register("is_enabled")} />
                                </div>
                                <input className="btn btn-primary" ref={submitStatus} id="submit" type="submit" data-bs-dismiss={Object.keys(errors)?.at(0) === undefined && 'modal'} />
                                
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

 function FormLoading( {isLoading} ) {
    return (
    <tbody className=" opacity-background-gray position-absolute h-100 w-100 d-none" ref={isLoading}>
        <tr></tr>
        <tr className=" d-flex justify-content-center align-items-center h-100">
            <td className="d-flex align-items-center border-0 bg-unset">
                <span className="material-icons pending">refresh</span>
                <p className="fs-4 fs-bolder"> 載入中...</p>
            </td>
        </tr>
    </tbody>)

}