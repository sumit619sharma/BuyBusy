// imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";

import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Error from "./components/Error"
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoutes from "./components/Protected-routes";
import Home from "./pages/Home";

function App() {
  // routes for different pages of the app with navbar as a parent route
  const router = createBrowserRouter([
    {
      path: "/", element: <Navbar />, errorElement: <Error />, children: [
        { index: true, element: <Home/> },
        { path: "/cart", element: <ProtectedRoutes> 
                            <Cart />
                            </ProtectedRoutes> },
        { path: "/orders", element: <ProtectedRoutes><Orders />
                                    </ProtectedRoutes> },
        { path: "/signup", element: <SignUp /> },
        { path: "/signin", element: <SignIn /> }
      ]
    }
  ])
  return (
    <>
      {/* toast */}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        transition={Slide}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
