import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

//const API_URL = "https://localhost:8443/salary";
const API_URL = "https://wh-d11b.onrender.com/salary";


export interface WorkDay {
    date: string,
    weekDay: string,
    comingTime: string,
    goingTime: string,
    hours: string,
    salary: string
}

interface WorkDayState {
    workDays: WorkDay[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface MonthsState {
    months: string[];
    currentMonth: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface StatsState {
    stats: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface InitialState {
    workDaysData: WorkDayState,
    statsData: StatsState,
    monthsData: MonthsState,
}

const initialState: InitialState = {
    workDaysData: {
        workDays: [],
        status: "idle",
        error: null
    },
    statsData: {
        stats: "",
        status: "idle",
        error: null
    },
    monthsData: {
        months: [],
        currentMonth: "",
        status: "idle",
        error: null
    }
};

export const fetchMonthsNames = createAsyncThunk(
    'workDay/fetchMonths',
    async (token: string) => {
        const response = await fetch(`${API_URL}/getMonths`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch months');
        }
        const data: string[] = await response.json();
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const sortedMonths = data.sort((a, b) => {
            const indexA = monthOrder.indexOf(a);
            const indexB = monthOrder.indexOf(b);
            return indexA - indexB;
        });

        return sortedMonths;
    });

export const fetchTableAsinc = createAsyncThunk(
    'workDay/fetchTable',
    async ({ token, month }: { token: string, month: string }) => {
        const response = await fetch(`${API_URL}/find/${month}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch table for ${month}`);
        }
        const data: WorkDay[] = await response.json();
        return data;
    });

export const fetchStatsAsinc = createAsyncThunk(
    'workDay/fetchStats',
    async ({ token, month, year }: { token: string, month: string, year: number }) => {
        const response = await fetch(`${API_URL}/getSalaryAfterTax/${month}/${year}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch status for ${month}`);
        }
        const data: string = await response.text();
        return data;
    });

export const addTableAsinc = createAsyncThunk(
    'workDay/addTable',
    async ({ token, month, year }: { token: string, month: string, year: number }) => {
        const response = await fetch(`${API_URL}/addMonth/${month}/${year}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to create table for ${month}`);
        }
        const data: WorkDay = await response.json();
        return data;
    });

export const deleteTableAsinc = createAsyncThunk(
    'workDay/deleteMonthTable',
    async ({ token, month, year }: { token: string, month: string, year: number }) => {
        const response = await fetch(`${API_URL}/deleteMonth/${month}/${year}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to create table for ${month}`);
        }
        const data: string = await response.text();
        return data;
    });

export const addTimeAsinc = createAsyncThunk(
    'workDay/addTime',
    async ({ token, date, coming, going }: { token: string, date: string, coming: string, going: string }) => {
        const response = await fetch(`${API_URL}/addTime/${date}/${coming}/${going}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to save time for date - ${date}`);
        }
        const data: WorkDay = await response.json();
        return data;
    });

export const deleteTimeAsinc = createAsyncThunk(
    'workDay/deleteTime',
    async ({ token, date }: { token: string, date: string }) => {
        const response = await fetch(`${API_URL}/deleteTime/${date}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to save time for date - ${date}`);
        }
        const data: WorkDay = await response.json();
        return data;
    });


const workTimeSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        clearTableData: () => {
            return initialState;
        },
        updateCurrentMonth: (state, action) => {
            state.monthsData.currentMonth = action.payload || (state.monthsData.months.length > 0 ? state.monthsData.months[0].toLowerCase() : '');
        },
    },
    extraReducers: (builder) => {
        builder
            //All months->
            .addCase(fetchMonthsNames.pending, (state) => {
                state.monthsData.status = 'loading';
                state.monthsData.error = null;
            })
            .addCase(fetchMonthsNames.fulfilled, (state, action) => {
                state.monthsData.status = 'succeeded';
                state.monthsData.months = action.payload;
                state.monthsData.error = null;
            })
            .addCase(fetchMonthsNames.rejected, (state, action) => {
                state.monthsData.status = 'failed';
                state.monthsData.error = action.error?.message || 'Unknown error';
            })

            //All tables by month->
            .addCase(fetchTableAsinc.pending, (state) => {
                state.workDaysData.status = 'loading';
                state.workDaysData.error = null;
            })
            .addCase(fetchTableAsinc.fulfilled, (state, action) => {
                state.workDaysData.status = 'succeeded';
                state.workDaysData.workDays = action.payload;
                state.workDaysData.error = null;
            })
            .addCase(fetchTableAsinc.rejected, (state, action) => {
                state.workDaysData.status = 'failed';
                state.workDaysData.error = action.error?.message || 'Unknown error';
            })

            //New table->
            .addCase(addTableAsinc.pending, (state) => {
                state.workDaysData.status = 'loading';
                state.workDaysData.error = null;
            })
            .addCase(addTableAsinc.fulfilled, (state, action) => {
                state.workDaysData.status = 'succeeded';
                state.workDaysData.workDays.push(action.payload);
                state.workDaysData.error = null;
            })
            .addCase(addTableAsinc.rejected, (state, action) => {
                state.workDaysData.status = 'failed';
                state.workDaysData.error = action.error?.message || 'Unknown error';
            })

            //delete table ->
            .addCase(deleteTableAsinc.pending, (state) => {
                state.workDaysData.status = 'loading';
                state.workDaysData.error = null;
            })
            .addCase(deleteTableAsinc.fulfilled, (state, action) => {
                state.workDaysData.status = 'succeeded';
                state.monthsData.months = state.monthsData.months.filter(item => item.toLowerCase() !== state.monthsData.currentMonth.toLowerCase());
                state.monthsData.currentMonth = state.monthsData.months.at(state.monthsData.months.length - 1) || "";
                state.workDaysData.error = null;
            })
            .addCase(deleteTableAsinc.rejected, (state, action) => {
                state.workDaysData.status = 'failed';
                state.workDaysData.error = action.error?.message || 'Unknown error';
            })

            //edite time ->
            .addCase(addTimeAsinc.pending, (state) => {
                state.workDaysData.status = 'loading';
                state.workDaysData.error = null;
            })
            .addCase(addTimeAsinc.fulfilled, (state, action) => {
                state.workDaysData.status = 'succeeded';
                const indexToUpdate = state.workDaysData.workDays.findIndex(e => e.date === action.payload.date);
                if (indexToUpdate !== -1) {
                    state.workDaysData.workDays[indexToUpdate] = action.payload;
                }
                state.workDaysData.error = null;
            })
            .addCase(addTimeAsinc.rejected, (state, action) => {
                state.workDaysData.status = 'failed';
                state.workDaysData.error = action.error?.message || 'Unknown error';
            })

            //Stats ->
            .addCase(fetchStatsAsinc.pending, (state) => {
                state.statsData.status = 'loading';
                state.statsData.error = null;
            })
            .addCase(fetchStatsAsinc.fulfilled, (state, action) => {
                state.statsData.status = 'succeeded';
                state.statsData.stats = action.payload;
                state.statsData.error = null;
            })
            .addCase(fetchStatsAsinc.rejected, (state, action) => {
                state.statsData.status = 'failed';
                state.statsData.error = action.error?.message || 'Unknown error';
            })
    },
});

export const selectWorkDays = (state: RootState) => state.workDays.workDaysData.workDays;
export const selectWorkDaysStatus = (state: RootState) => state.workDays.workDaysData.status;
export const selectWorkDaysError = (state: RootState) => state.workDays.workDaysData.error;

export const selectStats = (state: RootState) => state.workDays.statsData.stats;
export const selectStatsStatus = (state: RootState) => state.workDays.statsData.status;
export const selectStatsError = (state: RootState) => state.workDays.statsData.error;

export const selectMonths = (state: RootState) => state.workDays.monthsData.months;
export const selectCurrentMonth = (state: RootState) => state.workDays.monthsData.currentMonth;
export const selectMonthsStatus = (state: RootState) => state.workDays.monthsData.status;
export const selectMonthsError = (state: RootState) => state.workDays.monthsData.error;

export const { clearTableData, updateCurrentMonth } = workTimeSlice.actions;

export default workTimeSlice.reducer;

