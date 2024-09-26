// imports
import { Grid } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom"
import { useProductContext } from "../context/productContext";
import { useAuthContext } from "../context/authContext";
import { useEffect, useState } from "react";
import { fetchCartItems, productReducer, productSelector } from "../redux/reducers/product-reducer";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart,increaseCount, decreaseCount, clearCart, purchaseAll } from "../redux/reducers/product-reducer";
import { authSelector } from "../redux/reducers/auth-reducer";
function Cart() {
    //custom context
    const { userDetails: user } = useSelector(authSelector);
    const {cart, orders} = useSelector(productSelector); 
    const[loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const discount = Number((cart.cost * 0.10).toFixed(0));
    const billingPrice = Number((cart.cost - discount).toFixed(0));
   

    // load the pase for few moment for cart items to be fetched
    useEffect(() => {
        setTimeout(()=> {
            setLoading(false);
        }, 850);
    },[]);

    
    //fetch updated cart
    useEffect(() => {
        if(user){
           dispatch(fetchCartItems(user.email)) 
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[cart,user])

    // purchase items and go to orders page
    const handlePurchase = () => {
        dispatch(purchaseAll({ userEmail:user.email, currentCart: cart, currentOrders: orders }));
        dispatch(clearCart(user.email));
        navigate("/orders");
    }

    return (
        <>
            {loading ? <Grid
                height="80"
                width="80"
                color="#0d6efd"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperClass="loader-style"
                visible={true}
            /> :
                cart.items.length === 0 ?
                    <div className="mt-5  container d-flex flex-column align-items-center justify-content-center gap-3">
                        <i className="fa-regular fa-face-frown-open fs-1"></i>
                        <h6 className="display-6 "> Your BuyBusy Cart is Empty !</h6>
                        {user ? <Link to="/" className="btn btn-primary">Continue Shopping</Link> : <Link to="/signin" className="btn btn-primary">SignIn Now</Link>}
                    </div>
                    :
                    <div className="container text-center mt-2">
                        <h4 className="mb-3 text-center w-100 display-4">Your Cart</h4>
                        <div className="row row-cols-2">
                            <div className="col col-lg-8">
                                {cart.items.map((item, i) => (
                                    <div key={i} className="card mb-3 " style={{maxWidth: "90%", maxHeight: "200px"}}>
                                        <div className="row g-0">
                                            <div className="d-none d-lg-block  col-lg-4">
                                                <div className="w-100 h-100">
                                                    <img src={item.image} alt="..." className="rounded-start w-100" style={{objectFit: "fill", maxHeight: "200px"}} />
                                                </div>
                                            </div>
                                            <div className="col-12 col-lg-8">
                                                <div className="card-body text-start ">
                                                    <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                                                        <h5 className="card-title">{item.name}</h5>
                                                        <h5 className="card-title">₹{item.price}</h5>
                                                    </div>
                                                    <div className="d-flex align-items-baseline justify-content-start mb-4 w-25 ">
                                                        <i className="fa-solid fa-circle-plus fs-6 cart-icons me-3" onClick={() =>dispatch(increaseCount({ itemId: item.id, userEmail: user.email, currentCart:cart }))}></i>
                                                        <span className='card-text fs-4'> {item.count} </span>
                                                        <i className="fa-solid fa-circle-minus fs-6 cart-icons ms-3" onClick={() => dispatch(decreaseCount({ itemId: item.id, userEmail: user.email, currentCart:cart }))} ></i>
                                                    </div>
                                                    <button type="button" className="btn btn-danger" onClick={() => dispatch(removeFromCart({data: item, userEmail: user.email, currentCart: cart}))}>Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="col col-lg-4">
                                <div className="card">
                                    <h5 className="card-header">Summary</h5>
                                    <div className="card-body">
                                        <p className="card-text d-flex align-items-baseline justify-content-between "><span>Total Items:</span><span className="text-primary">{cart.count}</span></p>
                                        <p className="card-text d-flex align-items-baseline justify-content-between "><span>Total Amount:</span><span className="text-primary">{cart.cost}</span></p>
                                        <p className="card-text d-flex align-items-baseline justify-content-between "><span>Discount:</span><span className="text-primary">{discount}</span></p>
                                        <p className="card-text d-flex align-items-baseline justify-content-between "><span>Delivery Charges:</span><span className="text-primary">Free</span></p>
                                        <p className="card-text d-flex align-items-baseline justify-content-between border-top border-primary border-2 pt-2"><span>Billing Amount:</span><span className="text-primary">{billingPrice}</span></p>
                                        <div className="d-flex flex-column flex-md-row align-items-stretch justify-content-center gap-2">
                                            <button className="btn btn-primary" type="button" onClick={()=> dispatch(clearCart(user.email))}>Clear Cart</button>
                                            <button className="btn btn-primary" type="button" onClick={handlePurchase}>Purchase</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Cart;