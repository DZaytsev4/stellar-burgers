import feedReducer, { getFeeds, initialState } from './feedSlice';
import { TOrder, TOrdersData, RequestStatus } from '@utils-types';

describe('feedSlice', () => {
  const testOrder: TOrder = {
    _id: '1',
    status: 'done',
    name: 'Test Order',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    number: 123,
    ingredients: ['ingredient1', 'ingredient2']
  };

  const testOrdersData: TOrdersData = {
    orders: [testOrder],
    total: 1,
    totalToday: 1
  };

  test('Обработка состояния ожидания', () => {
    const action = { type: getFeeds.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Loading);
  });

  test('Обработка выполненного состояния', () => {
    const action = { type: getFeeds.fulfilled.type, payload: testOrdersData };
    const state = feedReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Success);
    expect(state.orders).toEqual(testOrdersData.orders);
    expect(state.total).toBe(testOrdersData.total);
    expect(state.totalToday).toBe(testOrdersData.totalToday);
  });

  test('Обработка отклоненного состояния', () => {
    const action = { type: getFeeds.rejected.type };
    const state = feedReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Failed);
  });
});
