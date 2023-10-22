import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

//const API_URL = "https://192.168.64.44:8443/profile";
const API_URL = "https://wh-d11b.onrender.com/profile";

export interface ProfileDto {
  token?: string;
  profileName?: string;
  email?: string;
  password?: string;
  hourlyRate?: number | string;
  dayBreakTimeInMinutes?: number| string;
  isLoggedIn?: false;
}

interface ProfileState {
  data: ProfileDto | null;
  token: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  token: '',
  status: 'idle',
  error: null,
};


export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async ({ email, token }: any) => {
    const response = await fetch(`${API_URL}/get/${email}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    const data: ProfileDto = await response.json();
    return data;
  });

export const registerProfileAsync = createAsyncThunk(
  'profile/registerProfile',
  async (profileData: ProfileDto, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        if (response.status >= 400 && response.status < 600) {
          const errorData = await response.json();
          return rejectWithValue({...errorData, redirect: false});
        } else {
          throw new Error('Network response was not ok');
        }
      }
      const data = await response.json();
      const token = data.token;
      return token;
    } catch (error: any) {
      return rejectWithValue({ message: error.message , redirect: false});
    }
  }
);

export const loginProfileAsync = createAsyncThunk(
  'profile/loginProfile',
  async (emailAndPassword: string) => {
    const base64EncodedData = btoa(emailAndPassword);
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + base64EncodedData
      }
    });
    if (!response.ok) {
      throw new Error('Failed to login');
    }
    const data = await response.json();
    const token = data.token;
    return token;
  });

export const logoutProfileAsync = createAsyncThunk(
  'profile/logoutProfile',
  async (token: string) => {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    if (!response.ok) {
      throw new Error('Failed to log out');
    }
    const data = await response.text();
    console.log(data);
    return data;
  });

export const deleteProfileAsync = createAsyncThunk(
  'profile/deleteProfile',
  async (token: string) => {
    const response = await fetch(`${API_URL}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    if (!response.ok) {
      throw new Error('Failed to log out');
    }
    const data = await response.json();
    console.log(data + " - removed succesfully");
    return data;
  });

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileData: () => {  
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder

      //Fetch profile ->
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message || 'Unknown error';
        state.status = 'failed';
      })

      //Registration ->
      .addCase(registerProfileAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(registerProfileAsync.fulfilled, (state, action) => {
        state.token = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerProfileAsync.rejected, (state, action) => {
        state.error = action.error?.message || 'Unknown error';
        state.status = 'failed';
      })

      //LogIn ->
      .addCase(loginProfileAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(loginProfileAsync.fulfilled, (state, action) => {
        state.token = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(loginProfileAsync.rejected, (state, action) => {
        state.error = action.error?.message || 'Unknown error';
        state.status = 'failed';
      })

      //logOut ->
      .addCase(logoutProfileAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(logoutProfileAsync.fulfilled, (state, action) => {
        state.token = "";
        state.data = initialState;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(logoutProfileAsync.rejected, (state, action) => {
        state.error = action.error?.message || 'Unknown error';
        state.status = 'failed';
      })

      //deleteProfile ->
      .addCase(deleteProfileAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(deleteProfileAsync.fulfilled, (state, action) => {
        state.token = "";
        state.data = initialState;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deleteProfileAsync.rejected, (state, action) => {
        state.error = action.error?.message || 'Unknown error';
        state.status = 'failed';
      })
  },
});

export const selectProfile = (state: RootState) => state.profile.data;
export const selectProfileStatus = (state: RootState) => state.profile.status;
export const selectProfileError = (state: RootState) => state.profile.error;
export const { clearProfileData } = profileSlice.actions;

export default profileSlice.reducer;

