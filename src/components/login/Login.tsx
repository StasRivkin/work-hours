import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProfile, loginProfileAsync } from '../../slices/profileSlice';
import { fetchMonthsNames, updateCurrentMonth } from '../../slices/workTimeSlice';

import "../loader/loader.css"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formProfileSubmitted, setFormProfileSubmitted] = useState(false);

    const token = useAppSelector(state => state.profile.token);
    const months = useAppSelector(state => state.workDays.monthsData.months);
    const profileStatus = useAppSelector(state => state.profile.status);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
                const parse = atob(base64);
                const email = JSON.parse(parse).sub;
                await dispatch(fetchProfile({ email, token }));
                await dispatch(fetchMonthsNames(token));
            }
        };
        fetchData();
    }, [token]);

    useEffect(() => {
        if (months.length > 0) {
            dispatch(updateCurrentMonth(months[months.length - 1].toLowerCase()));
            navigate("/profile");
        }
    }, [months])

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value.trim());
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value.trim());
    };


    const handleLogIn = () => {
        const emailAndPassword = email + ':' + password;
        dispatch(loginProfileAsync(emailAndPassword));
        setFormProfileSubmitted(true);
    };


    return (
        <div className='d-flex align-items-center justify-content-center' style={{ height: "80vh", backgroundColor: "#F8D501" }}>
            <form className="d-flex flex-column align-items-center justify-content-center bg-dark" style={{ borderRadius: "25px", width: "55vw", height: "37vh" }} onSubmit={handleLogIn}>
                {profileStatus === "loading" || formProfileSubmitted ?
                    <div className='text-white loading-dots'>
                        loading
                    </div>
                    :
                    <>
                        <div className="form-group m-1">
                            <input type="text" className="form-control" placeholder="Your Email *" value={email} onChange={handleEmailChange} />
                        </div>
                        <div className="form-group m-1">
                            <input type="password" className="form-control" placeholder="Your Password *" value={password} onChange={handlePasswordChange} />
                        </div>
                        <div className="form-group m-1">
                            <button type="button" className="btn btn-outline-light me-2" onClick={handleLogIn}>Login</button>
                        </div>
                    </>
                }
                { }
            </form>
        </div>
    )
}

export default Login
