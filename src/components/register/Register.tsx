import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ProfileDto, fetchProfile, registerProfileAsync } from '../../slices/profileSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

import "../loader/loader.css"

const Register = () => {
    const [nickName, setNickName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [hourlyRate, setHourlyRate] = useState<number | string>('');
    const [dayBreakTimeInMinutes, setDayBreakTimeInMinutes] = useState<number | string>('');
    const [formProfileSubmitted, setFormProfileSubmitted] = useState(false);

    const token = useAppSelector(state => state.profile.token);
    const profileStatus = useAppSelector(state => state.profile.status);
    const profileError = useAppSelector(state => state.profile.error);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const parse = atob(base64);
            const email = JSON.parse(parse).sub;
            dispatch(fetchProfile({ email, token }));
            navigate("/profile");
        }
    }, [token]);

    const handleNickNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNickName(e.target.value.trim());
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value.trim());
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value.trim());
    };

    const handleRegister = () => {
        if (email === "" || nickName === "" || password === "" || hourlyRate === "" || dayBreakTimeInMinutes === "") {
            alert("All fields must be filled");
            return;
        }
        if (/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            const profileData: ProfileDto = {
                profileName: nickName,
                email: email,
                password: password,
                hourlyRate: hourlyRate,
                dayBreakTimeInMinutes: dayBreakTimeInMinutes,
            };
            dispatch(registerProfileAsync(profileData));
            setFormProfileSubmitted(true);
        } else {
            alert("wrong email");
            setEmail("");
        }
    };

    const handleHourlyWageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) || value === '') {
            if (value === '' || parseInt(value) <= 299) {
                setHourlyRate(value !== '0' ? value : '');
            }
        }
    };

    const handleDayBreakTimeInMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) || value === '') {
            if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 120)) {
                setDayBreakTimeInMinutes(value);
            }
        }
    }

    return (
        <div className='d-flex align-items-center justify-content-center' style={{ height: "80vh", backgroundColor: "#F8D501" }}>
            <form className="d-flex flex-column align-items-center justify-content-center bg-dark" style={{ borderRadius: "25px", width: "55vw", height: "37vh" }} onSubmit={handleRegister}>
                {(profileStatus === "loading" || formProfileSubmitted) && !profileError ?
                    <div className='text-white loading-dots'>
                        loading
                    </div>
                    :
                    <>
                        <div className="form-group m-1">
                            <input type="text" className="form-control" placeholder="NickName *" value={nickName} onChange={handleNickNameChange} />
                        </div>
                        <div className="form-group m-1">
                            <input type="text" className="form-control" placeholder="Email *" value={email} onChange={handleEmailChange} />
                        </div>
                        {profileStatus === "failed" && profileError === "Rejected" && <div className='text-danger w-75 text-center p-0'>email already exists</div>}
                        <div className="form-group m-1">
                            <input type="password" className="form-control" placeholder="Password *" value={password} onChange={handlePasswordChange} />
                        </div>
                        <div className="form-group m-1">
                            <input type="number" className="form-control" placeholder="Hourly Rate *" value={hourlyRate} onChange={handleHourlyWageChange} />
                        </div>
                        <div className="form-group m-1">
                            <input type="number" className="form-control" placeholder="Break Time (in Minutes) *" value={dayBreakTimeInMinutes} onChange={handleDayBreakTimeInMinutesChange} />
                        </div>
                        <div className="form-group m-1">
                            <button type="button" className="btn btn-outline-light me-2" onClick={handleRegister}>Sign-up</button>
                        </div>
                    </>
                }
            </form>

        </div>
    )
}

export default Register
