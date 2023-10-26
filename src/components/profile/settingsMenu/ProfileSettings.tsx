import { ChangeEvent, MouseEvent, useRef, useState } from 'react';

import "./settingsMenu.css"
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { ProfileDto, changePasswordAsync, clearProfileData, deleteProfileAsync, updateProfileAsync } from '../../../slices/profileSlice';
import { clearTableData } from '../../../slices/workTimeSlice';

interface ProfileSettingsProps {
    show: boolean;
    setIsSettingsMenuVisible: () => void;
}

const ProfileSettings = ({ show, setIsSettingsMenuVisible }: ProfileSettingsProps) => {
    const containerRef = useRef(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [inHome, setInHome] = useState(() => location.pathname === '/home');
    const [inLogIn, setInLogIn] = useState(() => location.pathname === '/login');
    const [inRegister, setInRegister] = useState(() => location.pathname === '/register');

    const token: string = useAppSelector(state => state.profile.token);
    const profile: ProfileDto | null = useAppSelector(state => state.profile.data);

    const [newPassword, setNewPassword] = useState('');
    const [nickname, setNickname] = useState(profile?.profileName || '');
    const [hourlyRate, setHourlyRate] = useState(profile?.hourlyRate || '');
    const [fare, setFare] = useState(profile?.fare || '0');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);


    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    };

    const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    };

    const handleHourlyRateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setHourlyRate(e.target.value);
    };

    const handleFareChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFare(e.target.value);
    };

    const handleSave = async () => {
        if (newPassword === "") {
            dispatch(updateProfileAsync({ token, profileName: nickname, hourlyRate, fare }));
            setIsSettingsMenuVisible();
        } else {
            await dispatch(updateProfileAsync({ token, profileName: nickname, hourlyRate, fare }));
            await dispatch(changePasswordAsync({ token, newPassword }))
            setIsSettingsMenuVisible();
        }
    };

    const handleClose = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        if (event.target === containerRef.current) {
            setIsSettingsMenuVisible();
        }
    }

    const handleDeleteProfile = () => {
        setShowDeleteConfirmation(true)
    };

    const deleteProfile = () => {
        dispatch(clearProfileData());
        dispatch(clearTableData());
        setInHome(true);
        setInLogIn(false);
        setInRegister(false);
        dispatch(deleteProfileAsync(token))
        navigate("/home");
    };


    return (
        <div
            ref={containerRef}
            className={`month-input-popup ${show ? 'show' : ''}`}
            onClick={(e) => handleClose(e)}
        >
            <div className="bg-dark text-white d-flex flex-column align-items-center popup-content w-sm-50 w-md-75">
                <div className='popup-content'>
                    <ul className='list-unstyled'>
                        <li className='pb-4'>
                            <div className='fw-bold'>Email:</div> <div className='ms-3'>{profile?.email}</div>
                        </li>
                        <li className='pb-3'>
                            <div className='fw-bold'>Nickname:</div> <input className='bg-dark text-white border-dark' type="text" value={nickname} onChange={handleNicknameChange} />
                        </li>
                        <li className='pb-3'>
                            <div className='fw-bold'>Hourly rate:</div> <input className='bg-dark text-white border-dark' type="text" value={hourlyRate} onChange={handleHourlyRateChange} />
                        </li>
                        <li className='pb-3'>
                            <div className='fw-bold'>Fare:</div> <input className='bg-dark text-white border-dark' type="text" value={fare} onChange={handleFareChange} />
                        </li>
                        <li >
                            <div className='fw-bold'>New password:</div> <input className='bg-dark text-white border-dark' type="text" placeholder="New Password *" value={newPassword} onChange={handlePasswordChange} />
                        </li>
                    </ul>
                </div>
                <div className="button-container">
                    <button className='btn btn-warning m-2 w-75' onClick={handleSave}>Save</button>
                    <button className="btn btn-warning text-white bg-danger m-2 w-75" onClick={handleDeleteProfile}>Delete profile</button>
                </div>
            </div>
            {showDeleteConfirmation && (
                <div className="modal-overlay">
                    <div className="delete-confirmation-dialog bg-dark">
                        <p>Are you sure you want to delete your profile?</p>
                        <button className="btn btn-danger" onClick={deleteProfile}>Confirm</button>
                        <button className="btn btn-secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileSettings