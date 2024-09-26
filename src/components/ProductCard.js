// imports
import { useAuthContext } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useProductContext } from "../context/productContext";
import { useEffect, useState } from "react";
import { addToCart, productSelector, removeFromCart } from "../redux/reducers/product-reducer";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../redux/reducers/auth-reducer";

function ProductCard({ product }) {
    // custom context
    const { userDetails: user } = useSelector(authSelector)
    // const { removeFromCart } = useProductContext();
    const [isInCart, setIsInCart] = useState(false);
    const navigate = useNavigate();
   const {cart} = useSelector(productSelector);
   const dispatch = useDispatch();
    // identify which items are in cart
    useEffect(() => {
        const index = cart.items.findIndex((item) => item.id === product.id);
        if (index !== -1) {
            setIsInCart(true);
        } else {
            setIsInCart(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart, user])

    //add selected item in the cart
    async function handleAddCart(product) {
        if (!user) {
            navigate("/")
        } else {
            dispatch(addToCart({item:product,userEmail: user.email, currentCart: cart}));
        }
    }

    // remove selected item from cart
    async function handleRemoveCart(product) {
        dispatch( removeFromCart({data: product, userEmail: user.email, currentCart: cart}));
    }

    return (
        <div className="card border border-primary border-1 " style={{ width: "15rem" }}>
            <img src={product.image} className="card-img-top border-bottom border-1 border-primary-subtle  " alt="..." height={250} />
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text fs-5">₹{product.price}</p>
            </div>
            {user ?
                isInCart ?
                    <button type="button" className="btn btn-danger w-75 align-self-center mb-3 btn-lg fs-5" onClick={() => handleRemoveCart(product)}>Remove</button>
                    :
                    <button type="button" className="btn btn-primary w-75 align-self-center mb-3 btn-lg fs-5" onClick={() => handleAddCart(product)} >Add to Cart</button>
                :
                <Link to="signin" style={{display:"flex", width:"100%", justifyContent:"center", alignItems:"center"}}>
                            <button type="button" className="btn btn-primary w-75 align-self-center mb-3 btn-lg fs-5">Add to Cart</button>
        
                </Link>
                }
        </div >
    )
}

export default ProductCard;