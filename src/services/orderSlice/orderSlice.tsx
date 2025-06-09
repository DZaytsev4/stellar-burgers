import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, RequestStatus } from '@utils-types';
import { getOrderByNumberApi } from '@api';

export interface TOrderState {
  info: TOrder | null;
  status: RequestStatus;
}

export const initialState: TOrderState = {
  info: null,
  status: RequestStatus.Idle
};

export const getOrder = createAsyncThunk<TOrder, number>(
  'order/getOrder',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.info = action.payload;
        state.status = RequestStatus.Success;
      })
      .addCase(getOrder.rejected, (state) => {
        state.status = RequestStatus.Failed;
      });
  }
});

export const OrderActions = orderSlice.actions;
export default orderSlice.reducer;
