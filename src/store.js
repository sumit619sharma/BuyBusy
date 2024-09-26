import {configureStore} from "@reduxjs/toolkit"
import { authReducer } from "./redux/reducers/auth-reducer"
import { productReducer } from "./redux/reducers/product-reducer"
export const store = configureStore({
    reducer: {
        authReducer,
        productReducer,
    }
})