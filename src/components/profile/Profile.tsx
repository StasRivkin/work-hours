import { useAppDispatch, useAppSelector } from '../../app/hooks';
import "./profile.css"
import NavBar from './monthNavigation/NavBar';
import TableWorkHours from './table/TableWorkHours';
import { useEffect } from 'react';
import { WorkDay, fetchStatsAsinc, fetchTableAsinc } from '../../slices/workTimeSlice';

import "../loader/loader.css"

const Profile = () => {
  const tableStatus = useAppSelector(state => state.workDays.workDaysData.status);
  const statsStatus = useAppSelector(state => state.workDays.statsData.status);
  const months: string[] = useAppSelector(state => state.workDays.monthsData.months);
  const month: string = useAppSelector(store => store.workDays.monthsData.currentMonth);
  const token: string = useAppSelector(state => state.profile.token);
  const stats: string = useAppSelector(store => store.workDays.statsData.stats);

  const tables: WorkDay[] = useAppSelector(state => state.workDays.workDaysData.workDays);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (month) {
      const curMonth = month.toLowerCase();
      dispatch(fetchTableAsinc({ token, month: curMonth }));
    }
  }, [month]);

  useEffect(() => {
    if (month) {
      const curMonth = month.toLowerCase();
      dispatch(fetchStatsAsinc({ token, month: curMonth, year: 2023 }));
    }
  }, [tables]);

  return (
    <div className="d-flex align-content-start flex-wrap align-items-center justify-content-center" style={{ height: "80vh", backgroundColor: "#F8D501" }}>
      <NavBar months={months} />
      <div className="col-10 w-100" style={{ paddingTop: "0px" }}>
        {
          tableStatus === "loading" ?
            <div className='bg-dark text-white w-100 d-flex justify-content-center align-items-center; loading-dots' style={{ height: "100vh", paddingTop: "35vh" }}>
              loading
            </div>
            :
            <div className="table-responsive bg-dark">
              <TableWorkHours allTables={tables} />
              <div className='text-white text-end me-3'>
                {stats}
              </div>
            </div>
        }
      </div>
    </div>

  )
}

export default Profile