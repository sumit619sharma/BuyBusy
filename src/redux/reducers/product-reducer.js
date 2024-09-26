import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { data } from "../../data"
import { useSelector } from "react-redux"
import { authSelector } from "./auth-reducer"
import { doc, onSnapshot, updateDoc,getDoc } from "firebase/firestore"
import db from "../../firebaseInit"
import { toast } from "react-toastify"

const INITIAL_STATE = {
    products: data,
    cart: { count: 0, cost: 0, items: [] },
    orders: [],
    loading: false,
    error: null,
    filters : {
      searchText: '',
      filterPrice: 50000,
      filterCategories: [],
  }
  };

  // Asynchronous action to fetch cart items
export const fetchCartItems = createAsyncThunk(
    "product/fetchCartItems",
    async (userEmail, thunkAPI) => {
      try {
        const userDoc = await getDoc(doc(db, "users", userEmail));
        if (userDoc.exists()) {
          return userDoc.data().cart; // Return the cart items
        } else {
          return thunkAPI.rejectWithValue("No such user");
        }
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

// Asynchronous action to fetch orders
export const fetchOrders = createAsyncThunk(
    "product/fetchOrders",
    async (userEmail, thunkAPI) => {
      try {
        const userDoc = await getDoc(doc(db, "users", userEmail));
        if (userDoc.exists()) {
          return userDoc.data().orders; // Return the orders data
        } else {
          return thunkAPI.rejectWithValue("No such user");
        }
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
// Asynchronous action to add an item to the cart
export const addToCart = createAsyncThunk(
    "product/addToCart",
    async ({ item, userEmail, currentCart }, thunkAPI) => {
      const isItemPresent = currentCart.items.some((cartItem) => cartItem.id === item.id);
  
      if (isItemPresent) {
        return thunkAPI.rejectWithValue("Item already present in the cart!");
      }
  
      const updatedCart = {
        cost: currentCart.cost + item.price,
        count: currentCart.count + 1,
        items: [...currentCart.items, { ...item, count: 1 }],
      };
  
      try {
        await updateDoc(doc(db, "users", userEmail), { cart: updatedCart });
        return updatedCart; // Return the updated cart
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

 // Asynchronous action to remove an item from the cart
export const removeFromCart = createAsyncThunk(
    "product/removeFromCart",
    async ({ data, userEmail, currentCart }, thunkAPI) => {
      const removedItem = currentCart.items.find((item) => item.id === data.id);
      if (!removedItem) {
        return thunkAPI.rejectWithValue("Item not found in the cart.");
      }
  
      const updatedItems = currentCart.items.filter((item) => item.id !== data.id);
      const updatedCart = {
        cost: currentCart.cost - data.price * removedItem.count,
        count: currentCart.count - removedItem.count,
        items: updatedItems,
      };
  
      try {
        await updateDoc(doc(db, "users", userEmail), { cart: updatedCart });
        return updatedCart; // Return the updated cart after removal
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const increaseCount = createAsyncThunk(
    "product/increaseCount",
    async ({ itemId, userEmail, currentCart }, thunkAPI) => {
      const index = currentCart.items.findIndex((item) => item.id === itemId);
      if (index === -1) {
        return thunkAPI.rejectWithValue("Item not found in the cart.");
      }
  
      currentCart.items[index].count += 1;
      const updatedCart = {
        cost: currentCart.cost + currentCart.items[index].price,
        count: currentCart.count + 1,
        items: currentCart.items,
      };
  
      try {
        await updateDoc(doc(db, "users", userEmail), { cart: updatedCart });
        return updatedCart;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  
  export const decreaseCount = createAsyncThunk(
    "product/decreaseCount",
    async ({ itemId, userEmail, currentCart }, thunkAPI) => {
      const index = currentCart.items.findIndex((item) => item.id === itemId);
      if (index === -1) {
        return thunkAPI.rejectWithValue("Item not found in the cart.");
      }
  
      if (currentCart.items[index].count > 1) {
        currentCart.items[index].count -= 1;
        const updatedCart = {
          cost: currentCart.cost - currentCart.items[index].price,
          count: currentCart.count - 1,
          items: currentCart.items,
        };
  
        try {
          await updateDoc(doc(db, "users", userEmail), { cart: updatedCart });
          return updatedCart;
        } catch (error) {
          return thunkAPI.rejectWithValue(error.message);
        }
      } else {
        // If count is 1, remove the item from the cart
        return thunkAPI.dispatch(removeFromCart({ data: currentCart.items[index], userEmail, currentCart }));
      }
    }
  );

  
  export const clearCart = createAsyncThunk(
    "product/clearCart",
    async (userEmail, thunkAPI) => {
      const emptyCart = {
        cost: 0,
        count: 0,
        items: [],
      };
  
      try {
        await updateDoc(doc(db, "users", userEmail), { cart: emptyCart });
        return emptyCart;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const purchaseAll = createAsyncThunk(
    "product/purchaseAll",
    async ({ userEmail, currentCart, currentOrders }, thunkAPI) => {
      let date = new Date();
      let currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      let newOrder = {
        orderDate: currentDate,
        total: currentCart.cost,
        details: currentCart.items,
      };
  
      const updatedOrders = [newOrder, ...currentOrders];
      
      try {
        await updateDoc(doc(db, "users", userEmail), { orders: updatedOrders });
        return { updatedOrders, emptyCart: { cost: 0, count: 0, items: [] } }; // Return new orders and empty cart
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  

  const productSlice = createSlice({
    name: "product",
    initialState: INITIAL_STATE,
    reducers: {
      addFilter: (state, action)=> {
       state.filters = {...state.filters, [action.payload.key]: action.payload.value}
      },
      setProduct: (state,action) => {
        state.products = action.payload;
      }
      
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCartItems.pending, (state) => {
          state.loading = true; // Set loading to true when fetching starts
          state.error = null;   // Reset error state
        })
        .addCase(fetchCartItems.fulfilled, (state, action) => {
          state.loading = false;     // Set loading to false
          state.cart = action.payload; // Update cart with fetched items
        })
        .addCase(fetchCartItems.rejected, (state, action) => {
          state.loading = false;    // Set loading to false
          state.error = action.payload; // Set error if fetching fails
        })
        .addCase(fetchOrders.pending, (state) => {
            state.loading = true;  
            state.error = null;   
          })
          .addCase(fetchOrders.fulfilled, (state, action) => {
            state.loading = false;       // Set loading to false
            state.orders = action.payload; // Update orders with fetched data
          })
          .addCase(fetchOrders.rejected, (state, action) => {
            state.loading = false;     
            state.error = action.payload; 
          })
          .addCase(addToCart.pending, (state) => {
            state.loading = true; 
            state.error = null;   
          })
          .addCase(addToCart.fulfilled, (state, action) => {
            state.loading = false;       
            state.cart = action.payload; 
            toast.success("Item added successfully!"); 
          })
          .addCase(addToCart.rejected, (state, action) => {
            state.loading = false;       // Set loading to false
            state.error = action.payload; // Set error if adding fails
            toast.info(action.payload);   // Show info message if item already present
          })
          .addCase(removeFromCart.pending, (state) => {
            state.loading = true; 
            state.error = null;   
          })
          .addCase(removeFromCart.fulfilled, (state, action) => {
            state.loading = false;       
            state.cart = action.payload; // Update the cart with the new data
            toast.success("Item removed successfully!"); // Show success message
          })
          .addCase(removeFromCart.rejected, (state, action) => {
            state.loading = false;       
            state.error = action.payload; 
            toast.error(action.payload);   // Show error message if removal fails
          })
           // Increase Count
      .addCase(increaseCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(increaseCount.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(increaseCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Decrease Count
      .addCase(decreaseCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(decreaseCount.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(decreaseCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Purchase All
      .addCase(purchaseAll.pending, (state) => {
        state.loading = true;
      })
      .addCase(purchaseAll.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.updatedOrders;
        state.cart = action.payload.emptyCart; // Clear the cart after purchase
      })
      .addCase(purchaseAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    },
  });
  
  export const productReducer = productSlice.reducer;
  export const actions = productSlice.actions;
  export const productSelector = (state) => state.productReducer
  