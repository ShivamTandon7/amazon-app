import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../node_modules/axios/index";
import { useNavigate, useParams } from "react-router-dom";
import { detailsProduct, updateProduct } from "../actions/productActions";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { PRODUCT_UPDATE_RESET } from "../Constants/productConstants";


export default function ProductEditScreen(props) {
    const navigate = useNavigate();
    const params = useParams();
    const { id: productId } = params;
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;
    const productUpdate = useSelector(state=> state.productUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate} = productUpdate;
    const dispatch = useDispatch();
    useEffect(() => {
        if(successUpdate){
            dispatch({type: PRODUCT_UPDATE_RESET});
            navigate('/productlist');
        }
        if (!product || product._id !== productId || successUpdate) {
            dispatch({type: PRODUCT_UPDATE_RESET});
            dispatch(detailsProduct(productId));
        }
        else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setBrand(product.brand);
            setDescription(product.description);
        }
    }, [dispatch, product, productId, navigate, successUpdate]);
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            category,
            brand,
            countInStock,
            description,
        }))
    }

    const [ loadingUpload, setLoadingUpload] = useState(false);
    const [ errorUpload, setErrorUpload ] = useState('');
    const userSignin = useSelector(state=> state.userSignin);
    const { userInfo } = userSignin;
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image',file);
        setLoadingUpload(true);
        try {
            const {data} = await axios.post('/api/uploads', bodyFormData, {
                headers: {'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`,
                }
            })
            setImage(data);
            setLoadingUpload(false);
        }catch(err){
            setErrorUpload(err.message);
            setLoadingUpload(false);
        }
    } 
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>
                        Edit Product {productId}
                    </h1>
                </div>
                {loadingUpdate && <LoadingBox></LoadingBox>}
                {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                {loading ? <LoadingBox></LoadingBox> :
                    error ? <MessageBox variant="danger">{error}</MessageBox> :
                        <>
                            <div>
                                <label htmlFor="name">
                                    Name
                                </label>
                                <input id="name" type="text" placeholder="Enter Name" value={name}
                                    onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            <div>
                                <label htmlFor="price">
                                    Price
                                </label>
                                <input id="price" type="text" placeholder="Enter Price" value={price}
                                    onChange={(e) => setPrice(e.target.value)}></input>
                            </div>
                            <div>
                                <label htmlFor="image">
                                    Image
                                </label>
                                <input id="image" type="text" placeholder="Enter Image" value={image}
                                    onChange={(e) => setImage(e.target.value)}></input>
                            </div>
                            <div>
                                <label htmlFor="imageFile">
                                    Image File
                                </label>
                                <input id="imageFile" type="file" placeholder="Choose Image"
                                    onChange={uploadFileHandler}></input>
                                {loadingUpload && <LoadingBox></LoadingBox>}
                                {errorUpload && (<MessageBox variant="danger">{errorUpload}</MessageBox>)}    
                            </div>
                            <div>
                                <label htmlFor="category">
                                    Category
                                </label>
                                <input id="category" type="text" placeholder="Enter Category" value={category}
                                    onChange={(e) => setCategory(e.target.value)}></input></div>
                            <div>
                                <label htmlFor="brand">
                                    Brand
                                </label>
                                <input id="brand" type="text" placeholder="Enter Brand" value={brand}
                                    onChange={(e) => setBrand(e.target.value)}></input></div>
                            <div>
                                <label htmlFor="countInStock">
                                    Count In Stock
                                </label>
                                <input id="countInStock" type="text" placeholder="Enter Count In Stock" value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}></input></div>
                            <div>
                                <label htmlFor="description">
                                    Description
                                </label>
                                <textarea id="description" type="text" rows="3" placeholder="Enter Description" value={description}
                                    onChange={(e) => setDescription(e.target.value)}></textarea>
                            </div>
                            <div>
                                <label></label>
                                <button className="primary" type="submit">
                                    Update
                                </button>
                            </div>
                        </>}
            </form>
        </div>
    )
}