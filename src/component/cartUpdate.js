import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const cartUpdates = createApi({
    reducerPath: 'cartUpdates',
    baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_PATH_CLIENT_CART}),
    endpoints: (builder) => ({
        getCartData: builder.query({
          //query: (url) => url ->  const { data , error} = useGetCartDataQuery("") 有帶參數時
          query: () => ''
        })
})  
}) 

export const { useGetCartDataQuery } = cartUpdates
