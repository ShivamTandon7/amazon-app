import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../Components/CheckoutSteps';

export default function ShippingAddressScreen() {
    const navigate = useNavigate();
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    if (!userInfo) {
        navigate('/signin');
    }
    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;
    const userAddressMap = useSelector(state => state.userAddressMap);
    const { address: addressMap } = userAddressMap;
    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [lat, setLat] = useState(shippingAddress.lat || '');
    const [lng, setLng] = useState(shippingAddress.lng || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    const dispatch = useDispatch();
    const SubmitHandler = (e) => {
        e.preventDefault();
        const newLat = addressMap ? addressMap.lat : lat;
        const newLng = addressMap ? addressMap.lng : lng;
        if (addressMap) {
            setLat(addressMap.lat);
            setLng(addressMap.lng);
        }
        let moveOn = true;
        if (!newLat && !newLng) {
            moveOn = window.confirm('You did not set your location on map. Continue?');
        }
        if (moveOn) {
            dispatch(saveShippingAddress({ fullName, address, city, postalCode, country, lat: newLat, lng: newLng }));
        }
        navigate('/payment');
    }
    const chooseOnMap = () => {
        dispatch(saveShippingAddress({ fullName, address, city, postalCode, country, lat, lng }));
        navigate('/map');
    }
    return (
        <div>
            <CheckoutSteps step1 step2></CheckoutSteps>
            <form className='form' onSubmit={SubmitHandler}>
                <div>
                    <h1>Shipping Address</h1>
                </div>
                <div>
                    <label htmlFor="fullName">Full Name</label>
                    <input type="text" id="fullName" placeholder="Enter Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" placeholder="Enter Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" placeholder="Enter City" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="postalCode">Postal Code</label>
                    <input type="text" id="postalCode" placeholder="Enter Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="country">Country</label>
                    <input type="text" id="country" placeholder="Enter Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor='chooseOnMap'>Location</label>
                    <button type="button" onClick={chooseOnMap}>Choose On Map</button>
                </div>
                <div>
                    <label />
                    <button className="primary" type="submit">Continue</button>
                </div>
            </form>
        </div>
    )
}