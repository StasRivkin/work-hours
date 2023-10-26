import React, { MouseEvent, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { CalculateData, fetchTaxStatsAsinc } from '../../../slices/workTimeSlice';


interface StatsProps {
    show: boolean;
    setIsStatsVisible: () => void;
}

const StatsMenu = ({ show, setIsStatsVisible }: StatsProps) => {
    const containerRef = useRef(null);
    const dispatch = useAppDispatch();

    const token: string = useAppSelector(state => state.profile.token);
    const calculatedData: CalculateData | null = useAppSelector(state => state.workDays.statsData.calculatedData);
    const month: string = useAppSelector(store => store.workDays.monthsData.currentMonth);

    const handleClose = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        if (event.target === containerRef.current) {
            setIsStatsVisible();
        }
    }

    useEffect(() => {
        const curMonth = month.toLowerCase();
        dispatch(fetchTaxStatsAsinc({ token, month: curMonth, year: 2023 }));
    }, [])

    return (
        <div
            ref={containerRef}
            className={`month-input-popup ${show ? 'show' : ''}`}
            onClick={(e) => handleClose(e)}
        >
            <div className="bg-dark text-white d-flex flex-column align-items-center popup-content w-sm-50 w-md-75">
                <div className='popup-content'>
                    <ul>
                        <li>Income tax: {Number(calculatedData.incomeTax).toFixed(2)} ILS</li>
                        <li>Health insurance tax: {Number(calculatedData.healthInsuranceTax).toFixed(2)} ILS</li>
                        <li>Pension contribution tax: {Number(calculatedData.pensionContributionTax).toFixed(2)} ILS</li>

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default StatsMenu