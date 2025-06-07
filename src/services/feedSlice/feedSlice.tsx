import { TOrder, TOrdersData, RequestStatus } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import type { PayloadAction } from '@reduxjs/toolkit';

interface TFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: RequestStatus;
}

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: RequestStatus.Idle
};

export const getFeeds = createAsyncThunk<TOrdersData>(
  'feed/getFeeds',
  getFeedsApi
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(
        getFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.status = RequestStatus.Success;
        }
      )
      .addCase(getFeeds.rejected, (state) => {
        state.status = RequestStatus.Failed;
      });
  }
});

export const FeedActions = feedSlice.actions;
export default feedSlice.reducer;
