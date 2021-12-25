import React from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
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
import AdminRoute from './Components/AdminRoute';
import ProductListScreen from './Screen/ProductListScreen';
import ProductEditScreen from './Screen/ProductEditScreen';
import OrderListScreen from './Screen/OrderListScreen';

function App() {
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const dispatch = useDispatch();

    const signoutHandler = () => {
        dispatch(signout());
    }
    return (
        <BrowserRouter>
            <div className="grid-container">
                <header className="row">
                    <div>
                        <Link className="brand" to="/">amazona</Link>
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
                                    </ul>
                                  </div>  
                            )
                        }
                    </div>
                </header>
                <main>
                    <Route path="/cart/:id?" component={CartScreen}></Route>
                    <Route path="/product/:id" component={ProductScreen} exact></Route>
                    <Route path="/product/:id/edit" component={ProductEditScreen} exact></Route>
                    <Route path="/signin" component={SignInScreen}></Route>
                    <Route path="/register" component={RegisterScreen}></Route>
                    <Route path="/shipping" component={ShippingAddressScreen}></Route>
                    <Route path="/payment" component={PaymentMethodScreen}></Route>
                    <Route path="/placeOrder" component={PlaceOrderScreen}></Route>
                    <Route path="/order/:id" component={OrderScreen}></Route>
                    <Route path="/orderhistory" component={OrderScreenHistory}></Route>
                    <AdminRoute path="/productlist" component={ProductListScreen}></AdminRoute>
                    <AdminRoute path="/orderlist" component={OrderListScreen}></AdminRoute>
                    <PrivateRoute path="/profile" component={ProfileScreen}></PrivateRoute>
                    <Route path="/" component={HomeScreen} exact></Route>
                </main>
                <footer className="row center">
                    All Rights Reserved
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;
