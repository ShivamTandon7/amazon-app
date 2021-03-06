import { CART_ADD_ITEM, CART_ADD_ITEM_FAIL, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from "../Constants/cartConstants";
import Axios from 'axios';

export const addToCart = (productId, qty) => async (dispatch, getState) => {
    const { data } = await Axios.get(`/api/products/${productId}`);
    const { cart: { cartItems } } = getState();
    if (cartItems.length > 0 && data.seller._id !== cartItems[0].seller._id) {
        dispatch({ type: CART_ADD_ITEM_FAIL, payload: `Can't add to cart. Buy only from ${cartItems[0].seller.seller.name} in this order` });
    } else {
        dispatch({
            type: CART_ADD_ITEM,
            payload: {
                name: data.name,
                image: data.image,
                price: data.price,
                count: data.countInStock,
                product: data._id,
                seller: data.seller,
                qty,
            },
        })
        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    }
}

export const removeFromCart = (productId) => async (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: productId
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

export const saveShippingAddress = (data) => async (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    });
    localStorage.setItem('shippingAddress', JSON.stringify(data));
}

export const savePaymentMethod = (data) => async (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data
    });
}