import React, { useEffect, useRef, useState } from "react";
import LoadingBox from "../Components/LoadingBox";
import { LoadScript, StandaloneSearchBox, GoogleMap, Marker } from "@react-google-maps/api";
import Axios from 'axios';
import { USER_ADDRESS_MAP_CONFIRM } from "../Constants/userConstants";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const libs = ['places'];
const defaultLocation = { lat: 45.516, lng: -73.56};
export default function MapScreen() {
    const navigate = useNavigate();
    const [googleApiKey, setGoogleApiKey] = useState('');
    const [center, setCenter] = useState(defaultLocation);
    const [location, setLocation] = useState(center);
    
    const mapRef = useRef(null);
    const placeRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await Axios('/api/config/google');
            setGoogleApiKey(data);
        }
        fetch();
        getUserCurrentLocation();
    }, []);
    const onLoad = (map) => {
        mapRef.current = map;
    }
    const onMarkerLoad = (marker) => {
        markerRef.current= marker;
    }
    const onLoadPlaces = (place) => {
        placeRef.current= place;
    }
    const onIdle = () => {
        setLocation({lat: mapRef.current.center.lat(),
            lng: mapRef.current.center.lng()
        })
    }
    const onPlacesChanged = () => {
        const place = placeRef.current.getPlaces()[0].geometry.location;
        setCenter({lat: place.lat(), lng: place.lat()});
        setLocation({lat: place.lat(), lng: place.lat()});
    }
    const dispatch = useDispatch();
    const onConfirm = () => {
        const places = placeRef.current.getPlaces();
        if(places && places.length === 1){
            dispatch({
                type: USER_ADDRESS_MAP_CONFIRM,
                payload: {
                    lat: location.lat,
                    lng: location.lng,
                    address: places[0].formatted_address,
                    name: places[0].name,
                    vicinity: places[0].vicinity,
                    googleAddressId: places[0].id,
                }
            })
            alert('Location selected successfully');
            navigate('/shipping');
        }else{
            alert('Please enter your address');
        }

    }
    const getUserCurrentLocation = () => {
        if(!navigator.geolocation){
            alert('GeoLocation od not ssupported by this browser');
        }else{
            navigator.geolocation.getCurrentPosition((position)=>{
                setCenter({lat: position.coords.latitude, lng: position.coords.latitude});
                setLocation({lat: position.coords.latitude, lng: position.coords.latitude});
            })
        }
    }
    return (googleApiKey ?
        <div className="full-container">
            <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
            <GoogleMap id="sample-map" mapContainerStyles={{ height: '100%', width: '100%' }}
                center={center} zoom={15} onLoad={onLoad} onIdle={onIdle}>
                <StandaloneSearchBox onLoad={onLoadPlaces} onPlacesChanged={onPlacesChanged}>
                    <div className="map-input-box">
                        <input type="text" placeholder="Enter your address">

                        </input>
                        <button type="button" className="primary" onClick={onConfirm}>
                            Confirm
                        </button>
                    </div>
                </StandaloneSearchBox>
                <Marker position={location} onLoad={onMarkerLoad}></Marker>
            </GoogleMap>
            </LoadScript>
        </div> : (
            <LoadingBox></LoadingBox>
        )
    )
}