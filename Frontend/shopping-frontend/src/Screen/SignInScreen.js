import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { signin } from '../actions/userActions';
import { useSelector } from 'react-redux';
import LoadingBox from '../Components/LoadingBox';
import MessageBox from '../Components/MessageBox';
import { useNavigate } from 'react-router-dom';

export default function SignInScreen(props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {search} = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
    const dispatch = useDispatch();

    const userSignin = useSelector(state => state.userSignin);
    const { userInfo, loading, error } = userSignin;

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(signin(email, password));
    }

    useEffect(() => {
        if(userInfo){
            navigate(redirect);
        }
    },[navigate, redirect, userInfo]
    )
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Sign In</h1>
                </div>
                { loading && <LoadingBox></LoadingBox>}
                { error && <MessageBox variant="danger">{error}</MessageBox>}
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} required>
                    </input>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} required>
                    </input>
                </div>
                <div>
                    <label></label>
                    <button className="primary" type="submit">Sign In</button>
                </div>
                <div>
                    <label></label>
                    <div>
                        New Customer ? <Link to={`/register?redirect=${redirect}`}>Create your account</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}