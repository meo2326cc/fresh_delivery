import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './ToastSlice'
import cartReducer from "./CartSlice";
//import { cartUpdates } from "./cartUpdate";

export const Store = configureStore({
    reducer:{
            'toast':toastReducer,
            'cartUpdate':cartReducer,
            //[ cartUpdates.reducerPath ] : cartUpdates.reducer

    },
    // middleware:(getDefaultMiddleware) => 
    //     getDefaultMiddleware().concat(cartUpdates.middleware)
})