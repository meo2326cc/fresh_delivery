import { ClientNav , Footer } from "../component/ClientComponent";
import { Outlet } from "react-router";
import { Provider } from "react-redux";
import { ToastStore } from '../component/Store.jsx'
import Toast from "../component/Toast";

export default function FrontLayout(){

    return(<Provider store={ToastStore}>
    <Toast/>
    <ClientNav/>
    <Outlet/>
    <Footer/>
    </Provider>
    )
}