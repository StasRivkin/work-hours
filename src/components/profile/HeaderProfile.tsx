import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { clearProfileData, deleteProfileAsync, logoutProfileAsync } from "../../slices/profileSlice";
import { addTableAsinc, clearTableData, deleteTableAsinc, fetchMonthsNames } from "../../slices/workTimeSlice";
import MonthMenu from "./monthMenu/MonthMenu";

const HeaderProfile = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [inHome, setInHome] = useState(() => location.pathname === '/home');
    const [inLogIn, setInLogIn] = useState(() => location.pathname === '/login');
    const [inRegister, setInRegister] = useState(() => location.pathname === '/register');
    const [isMonthMenuVisible, setIsMonthMenuVisible] = useState<boolean>(false);

    const token: string = useAppSelector(state => state.profile.token);
    const months: string[] = useAppSelector(state => state.workDays.monthsData.months);
    const month: string = useAppSelector(state => state.workDays.monthsData.currentMonth);

    useEffect(() => {
        if (!token) {
            navigate("/home");
        }
    }, [token])

    const handleLogOut = () => {
        dispatch(logoutProfileAsync(token))
        setInHome(true);
        setInLogIn(false);
        setInRegister(false);
        dispatch(clearProfileData());
        dispatch(clearTableData());
        navigate("/home");
    };

    const handleDeleteProfile = () => {
        dispatch(clearProfileData());
        dispatch(clearTableData());
        setInHome(true);
        setInLogIn(false);
        setInRegister(false);
        dispatch(deleteProfileAsync(token))
        navigate("/home");
    };

    const handleDeleteTable = () => {
        dispatch(deleteTableAsinc({ token, month, year: 2023 }));
    };

    const handleAddMonth = async () => {
        setIsMonthMenuVisible(true);
    };

    return (
        <>
            <div className="btn-group">
                <button type="button" className="btn btn-secondary dropdown-toggle btn-warning" data-bs-toggle="dropdown" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                    </svg>
                </button>
                <ul className="dropdown-menu dropdown-menu-end bg-dark border-secondary border-4">
                    <li><button type="button" className="dropdown-item text-white bg-dark" onClick={handleAddMonth}>Add month</button></li>
                    <li><button type="button" className="dropdown-item text-white bg" onClick={handleDeleteTable}>Delete month</button></li>
                    <li><hr className="dropdown-divider text-white" /></li>
                    <li><button type="button" className="dropdown-item text-white bg-dark" onClick={handleLogOut}>Log-out</button></li>
                    <li><button type="button" className="dropdown-item text-white bg-danger" onClick={handleDeleteProfile}>Delete profile</button></li>
                </ul>
                {isMonthMenuVisible &&
                    <MonthMenu show={true} setIsMonthMenuVisible={() => setIsMonthMenuVisible(false)} />
                }
            </div>
        </>
    )
}

export default HeaderProfile