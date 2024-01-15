import axios from "axios";
import { useEffect, useReducer, useRef, memo, useCallback  } from "react";
import { useForm } from "react-hook-form";
import { Modal } from 'bootstrap';
import { useDispatch } from "react-redux";
import { success , fail } from "../ToastSlice";
import FormLoading from "../Pending";
import { useNavigate } from "react-router";


export default function Article() {

    const toIndexPage = useNavigate()
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
            const res = await axios.get(import.meta.env.VITE_PATH_ADMIN_ARTICLES_ALL)
            dispatch({ type: 'ADDDATA', payload: res.data.articles })
            console.log(res.data.articles)
        } catch(err) {
            dispatch({ type: 'NETWORK' })
            console.log(err)

            //  路由保護
            if(err.response.status === 401 && err.response.data.message === "驗證錯誤, 請重新登入" ) {
                document.cookie = 'hexToken=';
                toIndexPage('/')
            }

        }finally{
            isLoading.current.classList.add('d-none')
        }
    }, [])

    useEffect(() => {
        getData()
    }, [])

    return (<>
                <div className="container-fluid">
                    <h2 className="mt-3 mb-5">公告發佈-管理員</h2>
                    <button type="button" className="btn btn-primary mb-3" onClick={openAddModal}>新增品項</button>
                    {state.network ? 
                    <div className="position-relative">
                       
                         <table className="table table-striped align-middle">
                            <thead className="position-relative">
                                <tr className="border-dark">
                                    <th>#</th>
                                    <th>title</th>
                                    <th>建立日期</th>
                                    <th>公開</th>
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
                                            <td>{ new Date(item?.create_at).toLocaleString()}</td>
                                            <td>{item?.isPublic ? '是' : '否'}</td>
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
    


    const { type, cache } = editStatus

    const notificationDispatch = useDispatch()

    const submitStatus = useRef(null)



    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState:{errors}
    } = useForm({mode:'onBlur'})
    
    const watchfill = watch(['title','author'])

    //欄位皆填寫 && 沒有錯誤 ? 開放按鈕 : 鎖住按鈕
    watchfill.every((item)=> item !== ('' && NaN ) ) &&  (Object.keys(errors)?.[0] === undefined)  ? submitStatus?.current?.classList.remove('disabled') : submitStatus?.current?.classList.add('disabled')

    //初始unedfined時鎖住按鈕
    watchfill.every((item)=> item === undefined ) && submitStatus?.current?.classList.add('disabled')
   

    useEffect(() => {
        reset()
        reset({
            title: cache?.title,
            author: cache?.author,
            //content: cache?.content,
            content: cache?.description, //api未提供此欄位
            isPublic: cache?.isPublic,
            //image: cache?.image,
            create_at: cache?.create_at
        },{keepErrors:false, keepDirtyValues:true , keepDefaultValues:true})

        cache === null ?  submitStatus.current.classList.add('disabled') : submitStatus.current.classList.remove('disabled');



    }, [cache])

    const delProduct = async () => {
        isLoading.current.classList.remove('d-none')
        try {
            await axios.delete(import.meta.env.VITE_PATH_ADMIN_ARTICLE + cache.id )
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
            console.log(data)
            await axios.put(import.meta.env.VITE_PATH_ADMIN_ARTICLE + cache.id , {data: {...data , description : data.content } }  )
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
            await axios.post(import.meta.env.VITE_PATH_ADMIN_ARTICLE, { "data": { ...data , description : data.content ,  create_at: Date.now() } })
            notificationDispatch(success("新增成功"))
            getData()
        } catch (error) {
            notificationDispatch(fail(`新增失敗，原因：${error?.message}`))
            isLoading.current.classList.add('d-none')
            console.log(error)
        }

    }

    const onSubmit = function (data) {
        console.log(type)
       
        switch (type) {
            case '新增品項': addData(data)
                break;
            case '修改品項': editProduct(data)
                break;
        }

    }

    if (type === '刪除') {
        return (
            <div className="modal fade" ref={modalController} tabIndex="-1" aria-hidden="true" >
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
                            <button type="button" className="btn btn-secondary px-16" data-bs-dismiss="modal">取消</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else if (type !== '刪除') {
        return (
            <div className="modal fade" ref={modalController} tabIndex="-1" aria-hidden="true" >
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header bg-primary">
                            <h5 className="modal-title text-white">{cache ? '修改品項' : '新增品項'}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p className="py-3">標示<span className="text-danger">*</span>為必填欄位</p>
                            <form onSubmit={handleSubmit(onSubmit)} >
                                <div className="mb-1">
                                    <label htmlFor="title">標題 <span className="text-danger">*</span></label>
                                    <input className={`form-control ${ errors.title && 'is-invalid' }`} type="text" id="title" name="title" {...register("title", { required: true })} />
                                    <div className="invalid-feedback">請輸入標題</div>
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="author">作者 <span className="text-danger">*</span></label>
                                    <input className={`form-control ${ errors.author && 'is-invalid' }`} type="text" id="author" name="author" {...register("author", { required: true })} />
                                    <div className="invalid-feedback">請輸入作者</div>
                                </div>
                                {/* <div className="mb-1">
                                    <label htmlFor="description">文章內容</label>
                                    <textarea className="form-control" type="textarea" id="description" name="description" {...register("description")} />
                                </div>                                   */}
                                <div className="mb-1">
                                    <label htmlFor="content">詳細內容 <span className="text-danger">*</span></label>
                                    <textarea rows="5" className={`form-control ${ errors.content && 'is-invalid' }`} type="textarea" id="content" name="content" {...register("content" , { required : true } )} />
                                    <div className="invalid-feedback">內容不得為空</div>
                                </div>
                                {/* <div className="mb-1">
                                    <label htmlFor="image">主圖網址</label>
                                    <input className="form-control" type="text" id="image" name="image" {...register("image")} />
                                </div> */}
                                <div className="mb-1">
                                    <label htmlFor="isPublic">公開文章</label>
                                    <input type="checkbox" id="isPublic" name="isPublic" {...register("isPublic")} />
                                </div>
                                <input className={`btn btn-primary `} ref={submitStatus} id="submit" type="submit" data-bs-dismiss='modal' />
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


// {
//     "data": {
//       "title": "新增第一篇文章",
//       "description": "文章內容",
//       "image": "test.testtest",
//       "tag": [
//         "tag1"
//       ],
//       "create_at": 1555459220,
//       "author": "alice",
//       "isPublic": false,
//       "content": "這是內容"
//     }
//   }