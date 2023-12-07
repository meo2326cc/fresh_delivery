import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: 'cartUpdate',
    initialState:{
        carts:[]
    }
    ,reducers:{
        update( state , action ){
            console.log(action)
            return( action.payload )
        }
    }
})

export const { update } = cartSlice.actions
export default cartSlice.reducer