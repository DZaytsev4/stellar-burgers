import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, RequestStatus } from '@utils-types';
import { getOrdersApi } from '@api';

interface TOrdersState {
  orders: TOrder[];
  status: RequestStatus;
}

export const initialState: TOrdersState = {
  orders: [],
  status: RequestStatus.Idle
};

export const getOrders = createAsyncThunk<TOrder[]>(
  'orders/getOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(
        getOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.orders = action.payload;
          state.status = RequestStatus.Success;
        }
      )
      .addCase(getOrders.rejected, (state) => {
        state.status = RequestStatus.Failed;
      });
  }
});

export const OrdersActions = ordersSlice.actions;
export default ordersSlice.reducer;
