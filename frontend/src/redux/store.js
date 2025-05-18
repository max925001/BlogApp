import {configureStore} from '@reduxjs/toolkit'
import AuthSlice from './slices/AuthSlice'
import BlogSlice from './slices/BlogSlice'


const store = configureStore({
    reducer: {
        auth:AuthSlice,
        blogs:BlogSlice

    }
})


export default store