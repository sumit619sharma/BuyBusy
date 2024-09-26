/* eslint-disable jsx-a11y/anchor-is-valid */
// imports
import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import logo from "../images/Logo.png";
import { useAuthContext } from "../context/authContext";
import { useProductContext } from "../context/productContext";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../redux/reducers/auth-reducer";
import { logOut } from "../redux/reducers/auth-reducer";
import { productSelector, actions } from "../redux/reducers/product-reducer";
import { categories } from "../utils/categories";
function Navbar() {
  // custom context
  //const { user, logOut } = useAuthContext();
  const { userDetails: user } = useSelector(authSelector);
  console.log("user==", user);
  const { filters } = useSelector(productSelector);
  const { filterPrice, filterCategories } = filters;

  const dispatch = useDispatch();
  const location = useLocation();
  // get the search text from input
  const handleSearch = (e) => {
    const search = e.target.value;
    dispatch(actions.addFilter({ key: "searchText", value: search }));
  };

  // get the filter values from filter inputs
  const handleFilter = (category, price) => {
    if (category !== null) {
      if (filterCategories.includes(category)) {
        const temp = filterCategories.filter((cat) => cat !== category);
        dispatch(actions.addFilter({ key: "filterCategories", value: temp }));
      } else {
        dispatch(
          actions.addFilter({
            key: "filterCategories",
            value: [...filterCategories, category],
          })
        );
      }
    }
  };
  const handlePrice = (value) => {
    dispatch(actions.addFilter({ key: "filterPrice", value: value }));
  };

  return (
    <>
      <nav
        className="navbar sticky-top navbar-expand-lg bg-primary "
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src={logo}
              alt="Logo"
              width="200"
              height="50"
              className="logo"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mb-2 mb-lg-0 me-4 gap-4">
              {user && (
                <>
                  <li className="nav-item fs-5">
                    <NavLink
                      className="nav-link"
                      aria-current="page"
                      to="/orders"
                      style={({ isActive }) =>
                        isActive ? { color: "white" } : null
                      }
                    >
                      <span>
                        <i className="fa-solid fa-bag-shopping mx-2"></i>
                        My Order
                      </span>
                    </NavLink>
                  </li>
                  <li className="nav-item fs-5">
                    <NavLink
                      className="nav-link"
                      aria-current="page"
                      to="/cart"
                      style={({ isActive }) =>
                        isActive ? { color: "white" } : null
                      }
                    >
                      <span>
                        <i className="fa-sharp fa-solid fa-cart-shopping mx-2"></i>
                        Cart
                      </span>
                    </NavLink>
                  </li>
                </>
              )}
      
              {location.pathname === "/" && (
                <div className="nav-item dropdown">
                  <button
                    type="button"
                    className="nav-link dropdown-toggle fs-5"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    data-bs-auto-close="outside"
                  >
                    <span>
                      <i className="fa-solid fa-filter mx-2"></i>Filters
                    </span>
                  </button>
                  
                  <div className="dropdown-menu p-4">
                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">
                        Price: {filterPrice}
                      </label>
                      <input
                        className="form-range"
                        id="price"
                        type="range"
                        min="0"
                        max="50000"
                        step="50"
                        value={filterPrice}
                        onChange={(e) => handlePrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <hr className="dropdown-divider" />
                    </div>
                    <div className="mb-3">
                      <h6 className="dropdown-header ps-0 fs-5">Category</h6>
                      {categories.map((category, index) => {
                        return (
                          <div className="form-check" key={index}>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="dropdownCheck2"
                              onClick={() =>
                                handleFilter(category, filterPrice)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="dropdownCheck2"
                            >
                              {category}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                </div>
              )}
            </ul>
            {location.pathname === "/" && (
              <div className="d-flex">
                <input
                  className="form-control me-2 px-3"
                  style={{ width: "390px" }}
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={handleSearch}
                />
                <button className="btn btn-outline-light" type="button">
                  <span>
                    <i className="fa-solid fa-magnifying-glass mx-2"></i>
                  </span>
                </button>
              </div>
            )}
            {location.pathname !== "/signin" &&
              location.pathname !== "/signup" &&
              (user ? (
                <Link
                  className="btn btn-outline-light mx-2"
                  role="button"
                  to="/"
                  onClick={() => {
                    dispatch(logOut());
                  }}
                >
                  Sign Out
                </Link>
              ) : (
                <Link
                  className="btn btn-outline-light mx-2"
                  role="button"
                  to="/signin"
                >
                  Sign In
                </Link>
              ))}
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
