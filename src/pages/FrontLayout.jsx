import { ClientNav , Footer } from "../component/ClientComponent";
import { Outlet , useLocation } from "react-router";
import { Provider } from "react-redux";
import { Store } from '../component/Store.jsx'
import Toast from "../component/Toast";
import { useEffect } from "react";

export default function FrontLayout(){

    const location =  useLocation()

    useEffect(()=>{
        window.scrollTo(0,0)
    },[location])

    return(<Provider store={Store}>
    <Toast/>
    <ClientNav/>
    <Outlet/>
    <Footer/>
    </Provider>
    )
}