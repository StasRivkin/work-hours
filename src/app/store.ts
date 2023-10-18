import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import profileSlice from "../slices/profileSlice"
import workTimeSlice from "../slices/workTimeSlice"

export const store = configureStore({
  reducer: {
    profile: profileSlice,
    workDays: workTimeSlice,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
