import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import './timeMenu.css';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { WorkDay, addTimeAsinc, fetchStatsAsinc } from '../../../slices/workTimeSlice';

import "../../loader/loader.css"

interface TimeMenuProps {
    show: boolean;
    setIsTimeMenuVisible: () => void;
    selectedDate: string;
    selectedComingTime: string;
    selectedGoingTime: string;
}

const TimeMenu = ({ show, setIsTimeMenuVisible, selectedDate, selectedComingTime, selectedGoingTime }: TimeMenuProps) => {
    const containerRef = useRef(null);
    const [comingTime, setComingTime] = useState(selectedComingTime || "");
    const [goingTime, setGoingTime] = useState(selectedGoingTime || "");
    const [formTimeSubmitted, setFormTimeSubmitted] = useState(false);

    const tableStatus = useAppSelector(state => state.workDays.monthsData.status);
    const token: string = useAppSelector(state => state.profile.token);

    const table: WorkDay[] = useAppSelector(state => state.workDays.workDaysData.workDays);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (formTimeSubmitted) {
            const month = selectedDate.split("-")[1];
            dispatch(fetchStatsAsinc({ token, month: month, year: 2023 }));
            setIsTimeMenuVisible();
        }
    }, [formTimeSubmitted])

    const isValidTimeFormat = (time: string): boolean => {
        if (time === "") {
            return true;
        }
        return /^([01]\d|2[0-3])-([0-5]\d)$/.test(time) || /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
    };

    const parseTime = (time: string): Date => {
        const [hours, minutes] = time.split(/[-:]/).map(Number);
        const parsedTime = new Date();
        parsedTime.setHours(hours);
        parsedTime.setMinutes(minutes);
        return parsedTime;
    };

    const handleSave = () => {
        if (isValidTimeFormat(comingTime) &&
            isValidTimeFormat(goingTime) &&
            parseTime(comingTime) < parseTime(goingTime) &&
            (comingTime !== selectedComingTime || goingTime !== selectedGoingTime)) {
            dispatch(addTimeAsinc({ token: token, date: selectedDate, coming: comingTime, going: goingTime }));
            setFormTimeSubmitted(true);
        } else { setIsTimeMenuVisible(); }

    };

    const handleDelete = () => {
        if (comingTime === selectedComingTime || goingTime === selectedGoingTime) {
            setComingTime("-1");
            setGoingTime("-1");
            dispatch(addTimeAsinc({ token: token, date: selectedDate, coming: "-1", going: "-1" }));
            setFormTimeSubmitted(true);
        }
    };

    const handleClose = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        if (event.target === containerRef.current) {
            setIsTimeMenuVisible();
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, type: string) => {
        const inputValue: string = e.target.value;
        const cleanedInput: string = inputValue.replace(/\D/g, '').slice(0, 4);
        if (cleanedInput.length <= 2) {
            if (Number(cleanedInput[0]) <= 2) {
                type === "coming" ? setComingTime(cleanedInput) : setGoingTime(cleanedInput);
            }
            if (Number(cleanedInput) <= 23) {
                type === "coming" ? setComingTime(cleanedInput) : setGoingTime(cleanedInput);
            }
        } else if (cleanedInput.length === 3) {
            const hours: string = cleanedInput.slice(0, 2);
            const minutes: string = cleanedInput.slice(2);
            if (parseInt(hours, 10) <= 23 && parseInt(minutes, 10) <= 59) {
                type === "coming" ? setComingTime(`${hours}:${minutes}`) : setGoingTime(`${hours}:${minutes}`);
            }
        } else if (cleanedInput.length === 4) {
            const hours: string = cleanedInput.slice(0, 2);
            const minutes: string = cleanedInput.slice(2, 4);
            if (parseInt(hours, 10) <= 23 && parseInt(minutes, 10) <= 59) {
                type === "coming" ? setComingTime(`${hours}:${minutes}`) : setGoingTime(`${hours}:${minutes}`);
            }
        }
    };


    return (
        <>
            {
                tableStatus === "loading" || formTimeSubmitted ?
                    <div className={`time-input-popup-loader ${show ? 'show' : ''} bg-dark text-white loading-dots`}>
                        loading
                    </div>
                    :
                    <div
                        ref={containerRef}
                        className={`time-input-popup ${show ? 'show' : ''}`}
                        onClick={(e) => handleClose(e)}
                    >
                        <div className="bg-dark text-white d-flex flex-column align-items-center popup-content">
                            <div className='pb-3'>{selectedDate}</div>
                            <label>Coming time:</label>
                            <input
                                className='w-50'
                                type="text"
                                placeholder="00-00"
                                value={comingTime}
                                onChange={(e) => handleInputChange(e, "coming")}
                            />
                            <label>Going time:</label>
                            <input
                                className='w-50'
                                type="text"
                                placeholder="00-00"
                                value={goingTime}
                                onChange={(e) => handleInputChange(e, "going")}
                            />
                            <div className="button-container">
                                <button className='btn btn-warning w-100 m-1' onClick={handleSave}>Save</button>
                                <button className='btn btn-danger w-100 m-1' onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};

export default TimeMenu;