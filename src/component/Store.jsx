import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './ToastSlice'

export const ToastStore = configureStore({
    reducer:{
            'toast':toastReducer
    }
})