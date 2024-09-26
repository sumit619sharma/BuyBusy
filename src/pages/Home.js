// imports
/* eslint-disable no-unused-vars */
import { useProductContext } from "../context/productContext";
import { useAuthContext } from "../context/authContext";

import { data } from "../data";
import { useEffect,  } from "react";
import { Grid } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../redux/reducers/auth-reducer";
import { productSelector } from "../redux/reducers/product-reducer";
import { actions } from "../redux/reducers/product-reducer";
import ProductCard from "../components/ProductCard";

function Home() {
    // custom context
   const {userDetails:user, loading} = useSelector(authSelector);
    
    const { products ,filters} = useSelector(productSelector);
    const {filterPrice, filterCategories,searchText} = filters;
    const dispatch = useDispatch();
    // apply the filters on the products on load
    useEffect(() => {
        if (filterCategories.length === 0) {
            const filteredProducts = data.filter((product) => product.price <= filterPrice && product.name.toLowerCase().includes(searchText.toLowerCase()));
            dispatch(actions.setProduct(filteredProducts) );
        }
        else {
            const filteredProducts = data.filter((product) => product.price <= filterPrice && filterCategories.includes(product.category) && product.name.toLowerCase().includes(searchText.toLowerCase()));
            dispatch(actions.setProduct(filteredProducts) );
        }
    }, [searchText, filterCategories, filterPrice]);

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
                <div className="container h-100">
  
                    <div className="d-flex align-items-center justify-content-center w-100 border-bottom border-primary  border-2 my-3">
                        <h1 className="display-6 ">Welcome {user && user.name}</h1>
                    </div>
                    <div className="d-flex justify-content-evenly flex-wrap gap-3 my-3">
                        {products.map((product, i) => <ProductCard product={product} key={i} />)}
                    </div>
                    
                </div>}
        </>
    )
}

export default Home;