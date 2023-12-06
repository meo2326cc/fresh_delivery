import axios from "axios"
import { useEffect, useState } from "react"

export default function Cart() {

    const [cartContent, setCartContent] = useState([])
    //const cartIsLoading = useRef(null)
    const loading = () => {
        // cartIsLoading.current.classList.remove('d-none')
    }
    const loadingOver = () => {
        // cartIsLoading.current.classList.add('d-none')
    }


    async function getCartData() {
        try {
            loading()
            const res = await axios.get(import.meta.env.VITE_PATH_CLIENT_CART)
            setCartContent(res.data.data)
            loadingOver()
        } catch (error) {
            console.log(error)
        }
    }

    async function delCartItem(id) {
        loading()
        try {
            await axios.delete(import.meta.env.VITE_PATH_CLIENT_CART + id)
            const res = await axios.get(import.meta.env.VITE_PATH_CLIENT_CART)
            setCartContent(res.data.data.carts)

        } catch (error) {
            console.log(error)

        } finally {
            loadingOver()
        }
    }
    useEffect(() => {
        getCartData()
    }, [])

    return (<div className="container my-10">
        <h1 className="fs-2 mb-0">購物車</h1>
        <ul className="cartPage">
            {cartContent?.carts?.map(item => {
                return (<li className="bg-gray-300 d-flex justify-content-between align-items-center mb-2" key={item.id}>
                    <div className="d-flex align-items-center">
                        <img src={item?.product.imageUrl} className="w-100px h-100px object-fit" />
                        <div className="p-2">
                            <h2 className="fs-5 mb-3">{item?.product.title}</h2>
                            <div className="d-flex justify-content-between ">

                                <div className="d-flex justify-content-between">
                                    <p className="d-block me-2">數量</p>
                                    <button type="button" className=" btn btn-primary w-20px p-0"><p>-</p></button>
                                    <input type="text" value={2} className="border-0 w-38px text-center" readOnly />
                                    <button type="button" className=" btn btn-primary w-20px p-0"><p>+</p></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="me-2">單價：{item?.product.price}</p>
                    </div>
                </li>)


            })}
        </ul>
        <div className="cartPage bg-gray-300 px-1 py-2">
            {/* <p>total:{cartContent?.total}</p> */}
            <h3 className="fs-5 mb-0 text-end">總價: <span className="text-danger">{cartContent?.final_total}</span>  </h3>
        </div>



    </div>)
}