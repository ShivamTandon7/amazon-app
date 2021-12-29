import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ProductScreen from './Screen/ProductScreen';
import HomeScreen from './Screen/HomeScreen';
import CartScreen from './Screen/CartScreen';
import { useSelector } from 'react-redux';
import SignInScreen from './Screen/SignInScreen';
import { signout } from './actions/userActions';
import RegisterScreen from './Screen/RegisterScreen';
import ShippingAddressScreen from './Screen/ShippingAddressScreen';
import PaymentMethodScreen from './Screen/PaymentMethodScreen';
import PlaceOrderScreen from './Screen/PlaceOrderScreen';
import OrderScreen from './Screen/OrderScreen';
import OrderScreenHistory from './Screen/OrderScreenHistory';
import ProfileScreen from './Screen/ProfileScreen';
import PrivateRoute from './Components/PrivateRoute';
import ProductListScreen from './Screen/ProductListScreen';
import ProductEditScreen from './Screen/ProductEditScreen';
import OrderListScreen from './Screen/OrderListScreen';
import UserListScreen from './Screen/UserListScreen';
import UserEditScreen from './Screen/UserEditScreen';
import SellerRoute from './Components/SellerRoute';
import SellerScreen from './Screen/SellerScreen';
import SearchBox from './Components/SearchBox';
import SearchScreen from './Screen/SearchScreen';
import { listProductCategories } from './actions/productActions';
import MessageBox from './Components/MessageBox';
import LoadingBox from './Components/LoadingBox';
import MapScreen from './Screen/MapScreen';
import DashboardScreen from './Screen/DashboardScreen';
import SupportScreen from './Screen/SupportScreen';
import ChatBox from './Components/ChatBox';
import AdminRoute from './Components/AdminRoute';

function App() {
    const cart = useSelector(state => state.cart);
    const [sideBarIsOpen, setSideBarIsOpen] = useState(false);
    const { cartItems } = cart;
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const dispatch = useDispatch();

    const signoutHandler = () => {
        dispatch(signout());
    }
    const productCategoryList = useSelector(state => state.productCategoryList);
    const { loading: loadingCategories, errorCategories, categories } = productCategoryList;
    useEffect(() => {
        dispatch(listProductCategories());
    }, [dispatch]);
    return (
        <BrowserRouter>
            <div className="grid-container">
                <header className="row">
                    <div>
                        <button type='button' className='open-sidebar' onClick={() => setSideBarIsOpen(true)}>
                            <i className='fa fa-bars'></i>
                        </button>
                        <Link className="brand" to="/">amazona</Link>
                    </div>
                    <div>
                        <SearchBox />
                    </div>
                    <div>
                        <Link to="/cart">
                            Cart
                            {
                                cartItems.length > 0 && (
                                    <span className="badge">{cartItems.length}</span>
                                )
                            }
                        </Link>
                        {
                            userInfo ?
                                (
                                    <div className="dropdown">
                                        <Link to="#">{userInfo.name} <i className="fa fa-caret-down"></i>{' '}</Link>
                                        <ul className="dropdown-content">
                                            <li>
                                                <Link to='/profile'>User Profile</Link>
                                            </li>
                                            <li>
                                                <Link to='/orderhistory'>Order History</Link>
                                            </li>
                                            <li>
                                                <Link to='#signout' onClick={signoutHandler}>Sign Out</Link>
                                            </li>
                                        </ul>
                                    </div>
                                ) :
                                (<Link to="/signin">Sign In</Link>)

                        }
                        {
                            userInfo && userInfo.isSeller && (
                                <div className="dropdown">
                                    <Link to="#admin">Seller {' '} <i className="fa fa-caret-down"></i></Link>
                                    <ul className="dropdown-content">
                                        <li>
                                            <Link to="/productlist/seller">Products</Link>
                                        </li>
                                        <li>
                                            <Link to="/orderlist/seller">Orders</Link>
                                        </li>
                                    </ul>
                                </div>
                            )
                        }
                        {
                            userInfo && userInfo.isAdmin && (
                                <div className="dropdown">
                                    <Link to="#admin">Admin {' '} <i className="fa fa-caret-down"></i></Link>
                                    <ul className="dropdown-content">
                                        <li>
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li>
                                            <Link to="/productlist">Products</Link>
                                        </li>
                                        <li>
                                            <Link to="/orderlist">Orders</Link>
                                        </li>
                                        <li>
                                            <Link to="/userlist">Users</Link>
                                        </li>
                                        <li>
                                            <Link to="/support">Support</Link>
                                        </li>
                                    </ul>
                                </div>
                            )
                        }
                    </div>
                </header>
                <aside className={sideBarIsOpen ? 'open' : ''}>
                    <ul className='categories'>
                        <li>
                            <strong>Categories</strong>
                            <button onClick={() => setSideBarIsOpen(false)} className='close-sidebar' type="button">
                                <i className='fa fa-close'></i>
                            </button>
                        </li>
                        {loadingCategories ? (
                            <LoadingBox></LoadingBox>) :
                            errorCategories ? (
                                <MessageBox variant="danger">{errorCategories}</MessageBox>) :
                                (
                                    categories.map((c)=> (
                                        <li key={c}>
                                            <Link to={`/search/category/${c}`} onClick={()=> setSideBarIsOpen(false)}>
                                                {c}
                                            </Link>
                                        </li>
                                    ))
                                )
                                }
                    </ul>
                </aside>
                <main>
                    <Routes>
                    <Route path="/seller/:id" element={<SellerScreen />}></Route>
            <Route path="/cart" element={<CartScreen />}></Route>
            <Route path="/cart/:id" element={<CartScreen />}></Route>
            <Route
              path="/product/:id"
              element={<ProductScreen />}
              exact
            ></Route>
            <Route
              path="/product/:id/edit"
              element={ProductEditScreen}
              exact
            ></Route>
            <Route path="/signin" element={<SignInScreen />}></Route>
            <Route path="/register" element={<RegisterScreen />}></Route>
            <Route path="/shipping" element={<ShippingAddressScreen />}></Route>
            <Route path="/payment" element={<PaymentMethodScreen />}></Route>
            <Route path="/placeorder" element={<PlaceOrderScreen />}></Route>
            <Route path="/order/:id" element={<OrderScreen />}></Route>
            <Route
              path="/orderhistory"
              element={<OrderScreenHistory />}
            ></Route>
            <Route path="/search/name" element={<SearchScreen />} exact></Route>
            <Route
              path="/search/name/:name"
              element={<SearchScreen />}
              exact
            ></Route>
            <Route
              path="/search/category/:category"
              element={<SearchScreen />}
              exact
            ></Route>
            <Route
              path="/search/category/:category/name/:name"
              element={<SearchScreen />}
              exact
            ></Route>
            <Route
              path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber"
              element={<SearchScreen />}
              exact
            ></Route>

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfileScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/map"
              element={
                <PrivateRoute>
                  <MapScreen />
                </PrivateRoute>
              }
            />

            <Route
              path="/productlist"
              element={
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>
              }
            />

            <Route
              path="/productlist/pageNumber/:pageNumber"
              element={
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/orderlist"
              element={
                <AdminRoute>
                  <OrderListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/userlist"
              element={
                <AdminRoute>
                  <UserListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/user/:id/edit"
              element={
                <AdminRoute>
                  <UserEditScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <DashboardScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/support"
              element={
                <AdminRoute>
                  <SupportScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/productlist/seller"
              element={
                <SellerRoute>
                  <ProductListScreen />
                </SellerRoute>
              }
            />
            <Route
              path="/orderlist/seller"
              element={
                <SellerRoute>
                  <OrderListScreen />
                </SellerRoute>
              }
            />

            <Route path="/" element={<HomeScreen />} exact></Route>
                    </Routes>
                </main>
                <footer className="row center">
                    {userInfo && !userInfo.isAdmin && <ChatBox userInfo={userInfo}></ChatBox>}           
                    <div>All Rights Reserved</div>
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;
