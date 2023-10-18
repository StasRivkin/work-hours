import { WorkDay } from '../../../slices/workTimeSlice';
import { useAppSelector } from '../../../app/hooks';
import { useState } from 'react';
import TimeMenu from '../timeMenu/TimeMenu';

interface TableWorkHoursProps {
    allTables: WorkDay[];
}


const TableWorkHours = ({ allTables }: TableWorkHoursProps) => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedComingTime, setSectedComingTime] = useState<string>('');
    const [selectedGoingTime, setSelectedComingTime] = useState<string>('');
    const [isTimeMenuVisible, setIsTimeMenuVisible] = useState<boolean>(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

    const handleRowClick = (index: number, date: string, coming: string, going: string) => {
        setSelectedDate(date);
        setSectedComingTime(coming);
        setSelectedComingTime(going);
        setSelectedRowIndex(index);
        setIsTimeMenuVisible(true);
    };

    return (
        <div>
            <table className="table table-dark table-striped m-0">
                <thead className="fs-6">
                    <tr>
                        <th>date</th>
                        <th>week</th>
                        <th>coming</th>
                        <th>going</th>
                        <th>hours</th>
                        <th>salary</th>
                    </tr>
                </thead>
                <tbody>
                    {allTables && allTables.map((tableItem, index) => (
                        <tr
                            key={index}
                            onClick={() => handleRowClick(index, tableItem.date, tableItem.comingTime, tableItem.goingTime)}
                            className={selectedRowIndex === index ? 'selected-row' : ''}
                            style={{ color: tableItem.weekDay && (tableItem.weekDay.toUpperCase() === "FRI" || tableItem.weekDay.toUpperCase() === "SAT") ? "#F8D501" : "white" }}
                        >
                            <th>{tableItem.date}</th>
                            <td>{tableItem.weekDay && tableItem.weekDay.toUpperCase()}</td>
                            <td>{tableItem.comingTime}</td>
                            <td>{tableItem.goingTime}</td>
                            <td>{tableItem.hours}</td>
                            <td>{tableItem.salary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isTimeMenuVisible && (
                <TimeMenu show={true} setIsTimeMenuVisible={() => setIsTimeMenuVisible(false)} selectedDate={selectedDate} selectedComingTime={selectedComingTime} selectedGoingTime={selectedGoingTime} />
            )}
        </div>
    )
}

export default TableWorkHours;
