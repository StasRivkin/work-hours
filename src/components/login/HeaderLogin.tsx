import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const HeadreLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [inHome, setInHome] = useState(() => location.pathname === '/home');
    const [inLogIn, setInLogIn] = useState(() => location.pathname === '/login');
    const [inRegister, setInRegister] = useState(() => location.pathname === '/register');

    const handleHome = () => {
        setInHome(true);
        setInLogIn(false);
        setInRegister(false);
        navigate("/home");
    };

    return (
        <>
            <button type="button" className="btn btn-warning" onClick={handleHome}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                </svg>
            </button>
        </>
    )
}

export default HeadreLogin