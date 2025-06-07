import { configureStore} from '@reduxjs/toolkit';
import orderReducer, { getOrders, initialState } from './ordersSlice';
import { RequestStatus, TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

jest.mock('@api', () => ({
    getOrdersApi: jest.fn()
  }));
  
const mockGetOrdersApi = getOrdersApi as jest.MockedFunction<typeof getOrdersApi>;
  
const mockOrder: TOrder = {
  _id: 'order-id',
  status: 'done',
  name: 'Test Order',
  createdAt: '2024-07-01T00:00:00.000Z',
  updatedAt: '2024-07-01T00:00:00.000Z',
  number: 123,
  ingredients: ['ingredient1', 'ingredient2']
};
  
describe('ordersSlice', () => {
  beforeEach(() => {
    mockGetOrdersApi.mockReset();
  });
  
  describe('reducer', () => {
    test('Возвращение начального состояния', () => {
      expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  
    test('Обработка getOrders.pending', () => {
      const action = { type: getOrders.pending.type };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({ ...initialState, status: RequestStatus.Loading });
    });
  
    test('Обработка getOrders.fulfilled', () => {
      const action = {
        type: getOrders.fulfilled.type,
        payload: [mockOrder]
      };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({ ...initialState, orders: action.payload, status: RequestStatus.Success });
    });
  
    test('Обработка getOrders.rejected', () => {
      const action = { type: getOrders.rejected.type };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({ ...initialState, status: RequestStatus.Failed });
    });
  });
  
  describe('async thunk', () => {
    const createOrdersSliceTestStore = () => {
      return configureStore({
        reducer: {
          order: orderReducer
        },
      });
    };
  
    beforeEach(() => {
      mockGetOrdersApi.mockReset();
    });
  
    test('Успешное выполнение getOrders', async () => {
      mockGetOrdersApi.mockResolvedValue([mockOrder]);
  
      const store = createOrdersSliceTestStore();
      await store.dispatch(getOrders() as any);
      const state = store.getState().order;
  
      expect(state.orders).toEqual([mockOrder]);
      expect(state.status).toBe(RequestStatus.Success);
    });
  
    test('Ошибка в выполнении getOrders', async () => {
      mockGetOrdersApi.mockRejectedValue(new Error('Failed to fetch'));
  
      const store = createOrdersSliceTestStore();
      await store.dispatch(getOrders() as any);
      const state = store.getState().order;
  
      expect(state.orders).toEqual([]);
      expect(state.status).toBe(RequestStatus.Failed);
    });
  });
});