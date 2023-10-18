import { useEffect, useState } from 'react'
import clock from "../images/clock-logo.svg"
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import HeaderHome from './home/HeaderHome';
import HeaderLogin from './login/HeaderLogin';
import HeaderProfile from './profile/HeaderProfile';
import HeaderRegister from './register/HeaderRegister';

const Header = () => {
    const location = useLocation();
    
    const [inHome, setInHome] = useState(() => location.pathname === '/home');
    const [inLogIn, setInLogIn] = useState(() => location.pathname === '/login');
    const [inRegister, setInRegister] = useState(() => location.pathname === '/register');
    const [inProfile, setInProfile] = useState(() => location.pathname === '/profile');

    const token: string = useAppSelector(state => state.profile.token);

    useEffect(() => {
        if (location.pathname === '/home') {
            setInHome(true);
            setInLogIn(false);
            setInRegister(false);
            setInProfile(false);
        } else if (location.pathname === '/login') {
            setInHome(false);
            setInLogIn(true);
            setInRegister(false);
            setInProfile(false);
        } else if (location.pathname === '/register') {
            setInHome(false);
            setInLogIn(false);
            setInRegister(true);
            setInProfile(false);
        } else if (location.pathname === '/profile') {
            setInHome(false);
            setInLogIn(false);
            setInRegister(false);
            setInProfile(true);

        }
    }, [location.pathname]);

    return (
        <header className="p-3 bg-dark text-white d-flex flex-column justify-content-center justify-content-sm-end" style={{ height: "20vh" }}>
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <div className="text-start w-50">
                        <img src={clock} alt="clock" style={{ width: "20%", color: "yellow" }} />
                    </div>
                    <div className="text-end w-50">
                        {inHome && (<HeaderHome />)}
                        {inRegister && (<HeaderRegister />)}
                        {inLogIn && (<HeaderLogin />)}
                        {inProfile && (<HeaderProfile />)}
                    </div>
                </div>
            </div>
        </header >
    )
}

export default Header