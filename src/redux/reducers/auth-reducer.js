import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import db, {auth} from '../../firebaseInit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
const INITIAL_STATE = {
    userDetails: null,
    loading: false,
}
let currentUser =null


    export const signUp = createAsyncThunk("auth/signup",async (data, thunkAPI) => {
   const res =await createUserWithEmailAndPassword(auth, data.email, data.pswrd)
    
        console.log("Signed Up Successfully!");
        await updateProfile(res.user, {
            displayName: data.name
        });
         currentUser = {
            name: data.name,
            email: data.email, 
            pswrd: data.pswrd,
            cart: {
                count: 0,
                cost: 0,
                items: []
            },
            orders: []
        }
        return setDoc(doc(db, 'users', currentUser.email), currentUser);

    
    })

    export const logIn = createAsyncThunk("auth/logIn",async (data, thunkAPI) => {
        return signInWithEmailAndPassword(auth, data.email, data.pswrd)
         })

     export const logOut = createAsyncThunk("auth/logOut" ,() => {
        return  signOut(auth)
    })

    const authSlice = createSlice({
        name: 'auth',
        initialState: INITIAL_STATE,
        reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(signUp.fulfilled,(state,action) => {
             state.userDetails = currentUser;
             state.loading =false;
        })
        .addCase(signUp.rejected, (state) => {
            state.loading =false;
        })
        .addCase(logIn.fulfilled,(state,action) => {
            console.log('login==', action.payload)
            currentUser = {
                name: action.payload.user.displayName,
                email: action.payload.user.email,
                pswrd: '',
                cart: {
                    count: 0,
                    cost: 0,
                    items: []
                },
                orders: []
            }
            state.userDetails = currentUser; 
            toast.success("Signed In Successfully 🥳");
        })
        .addCase(logOut.fulfilled,(state,action) => {
            console.log('logout get called')
            state.userDetails = null; 
            toast.success("Signed In Successfully 🥳");
        })
        .addCase(logOut.rejected,(state,action) => {
            console.log('logout get called , rejected')
            state.userDetails =null;
            toast.error("something went wrong..");
        })
    }
})
export const authSelector=(state) => state.authReducer;
export const authReducer = authSlice.reducer;
export const actions = authSlice.actions