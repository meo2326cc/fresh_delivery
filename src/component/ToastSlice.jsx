import { createSlice } from "@reduxjs/toolkit";


export const toastSlice = createSlice({
    name:'toast',
    initialState:{
            message:'',
            bgColor:''
        }
    ,
    reducers:{
        success( state , action ){
            return( {message: action.payload , bgColor:'bg-success'} )
        },
        fail( state , action ){
            return( {message: action.payload , bgColor:'bg-danger'} )
        }
}})

export const { success , fail } = toastSlice.actions
export default toastSlice.reducer