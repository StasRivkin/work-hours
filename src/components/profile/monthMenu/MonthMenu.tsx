import { MouseEvent, useEffect, useRef, useState } from 'react';
import './monthMenu.css';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addTableAsinc, fetchMonthsNames, fetchTableAsinc, selectMonths, updateCurrentMonth } from '../../../slices/workTimeSlice';

import "../../loader/loader.css"

interface MonthMenuProps {
    show: boolean;
    setIsMonthMenuVisible: () => void;
}

const MonthMenu = ({ show, setIsMonthMenuVisible }: MonthMenuProps) => {
    const containerRef = useRef(null);
    const [formMonthSubmitted, setFormMonthSubmitted] = useState(false);
    const [month, setMonth] = useState<string>("");
   
    const token: string = useAppSelector(state => state.profile.token);

    const months: string[] = useAppSelector(state => state.workDays.monthsData.months);
    const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const tableStatus = useAppSelector(state => state.workDays.monthsData.status);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (formMonthSubmitted) {
            const fetchData = async () => {
                const curMonth = month.toLowerCase();
                await dispatch(fetchTableAsinc({ token, month: curMonth }));
                await dispatch(fetchMonthsNames(token));

                setIsMonthMenuVisible();
            };
            fetchData();
        }
    }, [formMonthSubmitted])


    const handleSave = async () => {
        if (month) {
            await dispatch(addTableAsinc({ token: token, month: month.toLowerCase(), year: 2023 }))
            dispatch(updateCurrentMonth(month.toLowerCase()));
            setFormMonthSubmitted(true);

        }
    };

    const handleClose = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        if (event.target === containerRef.current) {
            setIsMonthMenuVisible();
        }
    }

    return (
        <>
            {
                tableStatus === "loading" || formMonthSubmitted ?
                    <div className={`month-input-popup-loader ${show ? 'show' : ''} bg-dark text-white loading-dots`}>
                        loading
                    </div>
                    :
                    <div
                        ref={containerRef}
                        className={`month-input-popup ${show ? 'show' : ''}`}
                        onClick={(e) => handleClose(e)}
                    >
                        <div className="bg-dark text-white d-flex flex-column align-items-center popup-content">
                            <div className='popup-content'>
                                <ul className='list-unstyled'>
                                    {fullMonths.filter(month => !months.includes(month)).map((month) => (
                                        <li key={month} className='list-item' onClick={() => setMonth(month)}>
                                            {month}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="button-container">
                                <button className='btn btn-warning w-100 m-1' onClick={handleSave}>Add</button>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};

export default MonthMenu;