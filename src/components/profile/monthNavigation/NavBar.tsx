import "./navBar.css"
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { updateCurrentMonth } from "../../../slices/workTimeSlice";
import { useState, useEffect } from "react";

interface navBarProps {
    months: string[];
}

const NavBar = ({ months }: navBarProps) => {
    const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0);
    const currentMonth = useAppSelector(store => store.workDays.monthsData.currentMonth);
    const dispatch = useAppDispatch();
    

    useEffect(() => {
        const initialMonthIndex = months.findIndex(month => month.toLowerCase() === currentMonth.toLowerCase());
        setSelectedMonthIndex(initialMonthIndex >= 0 ? initialMonthIndex : 0);
    }, [months, currentMonth]);

    const handleGetMonth = (index: number) => {
        setSelectedMonthIndex(index);
        dispatch(updateCurrentMonth(months[index].toLowerCase()));
    };

    return (
        <div className="scrollable-navbar d-flex flex-nowrap overflow-auto bg-dark w-100">
            {months.map((month, index) => (
                <button key={index} type="button" className={`btn m-0 navButton ${selectedMonthIndex === index ? "selected" : ""}`} onClick={() => handleGetMonth(index)}>{month}</button>
            ))}
        </div>
    );
}

export default NavBar;
