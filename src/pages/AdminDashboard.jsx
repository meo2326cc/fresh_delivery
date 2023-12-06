import axios from "axios";
import { useEffect  } from "react";
import { useNavigate , Outlet , Link} from "react-router-dom"
//import { reducer , state as notificationState , NotificationContext } from "../component/ToastStore.jsx";
import { Offcanvas } from 'bootstrap';
import Toast from "../component/Toast";
import { Provider } from "react-redux";
import { ToastStore } from "../component/Store";


export default function AdminDashboard() {




    const toIndexPage = useNavigate();
    const token = document.cookie.split(';').find((row) => row.startsWith('hexToken='))?.split('=')[1];
    axios.defaults.headers.common['Authorization'] = token;

    const logout = async function () {
        await axios.post(import.meta.env.VITE_PATH_ADMIN_LOGOUT);
        document.cookie = 'hexToken=';
        toIndexPage('/')
    }
    //
    console.log(' dashboard - rerender')
    //
    useEffect(() => {
        if (token === '' || token === undefined) {
         toIndexPage('/')
        }
    }, [])    

    return (
        <Provider store={ToastStore}>
        <Toast/>
        <div className="d-flex vh-100">
            <div className="w-260px d-none d-md-flex justify-content-center bg-light pt-10" id="collapseExample">
                <ul className="fs-6 w-100 text-center list-group">
                    <li className="text-dark list-group-item-action"><Link to='products' className="d-block py-3">產品列表</Link></li>
                    <li className="text-dark list-group-item-action"><Link to='coupon' className="d-block py-3">優惠券列表</Link></li>
                    <li className="text-dark list-group-item-action"><Link to='order' className="d-block py-3">管理訂單</Link></li>
                </ul>
            </div>
            <div className="dashboard flex-grow-1 overflow-auto">
                {/* nav */}
                <div className="sticky-top border-1 ps-3 py-3 nav navbar-expand-md border d-flex justify-content-between align-items-center container-fluid bg-white">
                    <div>
                    <button className="btn d-md-none border" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    <span className="material-icons">menu</span>
                    </button>     
                    </div>
                    <div className="d-flex align-items-center">
                        <p className="me-3">歡迎</p>
                        <button className="btn btn-danger" type="button" onClick={logout}>登出</button></div>
                    </div>
                {/* canva */}
                <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                    <div className="offcanvas-header">
                        {/* <h5 className="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5> */}
                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <div>
                            <ul className="fs-6 w-100 text-center list-group">
                               <li className="text-dark list-group-item-action" data-bs-dismiss="offcanvas"><Link to="products" className="d-block py-3">產品列表</Link></li>
                                <li className="text-dark list-group-item-action" data-bs-dismiss="offcanvas"><Link to="coupon" className="d-block py-3">優惠券列表</Link></li>
                                <li className="text-dark list-group-item-action" data-bs-dismiss="offcanvas"><Link to="order" className="d-block py-3">管理訂單</Link></li>
                                
                            </ul>
                        </div>
                    </div>
                </div>

                <Outlet/>

            </div>
        </div></Provider >)
}