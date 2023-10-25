import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { clearProfileData, logoutProfileAsync } from "../../slices/profileSlice";
import { clearTableData, deleteTableAsinc } from "../../slices/workTimeSlice";
import MonthMenu from "./monthMenu/MonthMenu";
import ProfileSettings from "./settingsMenu/ProfileSettings";

const HeaderProfile = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [inHome, setInHome] = useState(() => location.pathname === '/home');
    const [inLogIn, setInLogIn] = useState(() => location.pathname === '/login');
    const [inRegister, setInRegister] = useState(() => location.pathname === '/register');
    const [isMonthMenuVisible, setIsMonthMenuVisible] = useState<boolean>(false);
    const [IsSettingsMenuVisible, setIsSettingsMenuVisible] = useState<boolean>(false);

    const [showgreeting, setShowgreeting] = useState(true);

    const token: string = useAppSelector(state => state.profile.token);
    const month: string = useAppSelector(state => state.workDays.monthsData.currentMonth);
    const profileName: string | undefined = useAppSelector(state => state.profile.data?.profileName);

    useEffect(() => {
        if (!token) {
            navigate("/home");
        }
    }, [token])

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowgreeting(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleLogOut = () => {
        dispatch(logoutProfileAsync(token))
        setInHome(true);
        setInLogIn(false);
        setInRegister(false);
        dispatch(clearProfileData());
        dispatch(clearTableData());
        navigate("/home");
    };

    const handleDeleteTable = () => {
        dispatch(deleteTableAsinc({ token, month, year: 2023 }));
    };

    const handleAddMonth = async () => {
        setIsMonthMenuVisible(true);
    };

    const handleEditeProfile = async () => {
        setIsSettingsMenuVisible(true);
    };

    return (
        <div className={`d-flex ${showgreeting ? "justify-content-between" : "justify-content-end"} align-items-center`}>
            {showgreeting && <div className="fade-out">Hello {profileName} !</div>}
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
                    <li><button type="button" className="dropdown-item text-white bg-dark" onClick={handleEditeProfile}>Profile</button></li>
                    <li><button type="button" className="dropdown-item text-black bg-danger" onClick={handleLogOut}>Log-out</button></li>
                </ul>
                {isMonthMenuVisible &&
                    <MonthMenu show={true} setIsMonthMenuVisible={() => setIsMonthMenuVisible(false)} />
                }
                {IsSettingsMenuVisible &&
                    <ProfileSettings show={true} setIsSettingsMenuVisible={() => setIsSettingsMenuVisible(false)} />
                }
            </div>
        </div>
    )
}

export default HeaderProfile