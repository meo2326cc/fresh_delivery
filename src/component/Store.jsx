import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './ToastSlice'
import cartReducer from "./CartSlice";

export const Store = configureStore({
    reducer:{
            'toast':toastReducer,
            'cartUpdate':cartReducer
    }
})