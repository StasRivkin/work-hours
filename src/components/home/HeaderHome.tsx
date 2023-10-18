import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useState } from "react";

const HeaderHome = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [inHome, setInHome] = useState(() => location.pathname === '/home');
    const [inLogIn, setInLogIn] = useState(() => location.pathname === '/login');
    const [inRegister, setInRegister] = useState(() => location.pathname === '/register');

    const token: string = useAppSelector(state => state.profile.token);

    const handleLogin = () => {
        setInHome(false);
        setInLogIn(true);
        setInRegister(false);
        navigate("/login");
    };

    const handleSignUp = () => {
        setInHome(false);
        setInLogIn(false);
        setInRegister(true);
        navigate("/register");
    };
    return (
        <>
            {inHome && !token && (
                <>
                    <button type="button" className="btn btn-outline-light me-2" onClick={handleLogin}>Log-in</button>
                    <button type="button" className="btn btn-warning" onClick={handleSignUp}>Sign-up</button>
                </>)
            }
            {
                inHome && token && (
                    <button type="button" className="btn btn-outline-light me-2" onClick={handleLogin}>Profile</button>
                )
            }
        </>
    )
}

export default HeaderHome