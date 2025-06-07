import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  logoutApi,
  updateUserApi,
  TRegisterData
} from '@api';
import { setCookie } from '../../utils/cookie';
import { isActionPending, isActionRejected } from '../../utils/redux';
import { deleteCookie } from '../../utils/cookie';
import { TUser, RequestStatus } from '@utils-types';

interface TUserState {
  isAuthChecked: boolean;
  data: TUser | null;
  requestStatus: RequestStatus;
}

export const initialState: TUserState = {
  isAuthChecked: false,
  data: null,
  requestStatus: RequestStatus.Idle
};

export const registerUser = createAsyncThunk<
  TUser,
  { name: string; email: string; password: string }
>('user/registerUser', async (user) => {
  const data = await registerUserApi(user);
  return data.user;
});

export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string }
>('user/loginUser', async (user) => {
  const data = await loginUserApi(user);
  setCookie('accessToken', data.accessToken);
  setCookie('refreshToken', data.refreshToken);
  return data.user;
});

export const checkUserAuth = createAsyncThunk<TUser>(
  'user/checkUserAuth',
  async () => {
    const response = await getUserApi();
    return response.user;
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/updateUser',
  async (user) => {
    const response = await updateUserApi(user);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { dispatch }) => {
    try {
      await logoutApi();
      localStorage.clear();
      deleteCookie('accessToken');
      dispatch(userActions.userLogout());
    } catch (error) {
      console.log('Ошибка выполнения выхода');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.data = action.payload;
      state.requestStatus = RequestStatus.Success;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.data = action.payload;
      state.requestStatus = RequestStatus.Success;
    });
    builder.addCase(checkUserAuth.fulfilled, (state, action) => {
      state.data = action.payload;
      state.requestStatus = RequestStatus.Success;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.data = action.payload;
      state.requestStatus = RequestStatus.Success;
    });
    builder.addMatcher(isActionPending(userSlice.name), (state) => {
      state.requestStatus = RequestStatus.Loading;
    });
    builder.addMatcher(isActionRejected(userSlice.name), (state) => {
      state.requestStatus = RequestStatus.Failed;
    });
  },
  selectors: {
    getUser: (state: TUserState) => state.data,
    getIsAuthChecked: (state: TUserState) => state.isAuthChecked
  }
});

export const userActions = userSlice.actions;
export const userSelectors = userSlice.selectors;
export default userSlice.reducer;
