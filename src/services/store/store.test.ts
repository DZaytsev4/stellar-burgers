import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../ingredientsSlice/ingredientsSlice';
import { userSlice } from '../userSlice/userSlice';
import { burgerConstructorSlice } from '../burgerConstuctorSlice/burgerConstructorSlice';
import { feedSlice } from '../feedSlice/feedSlice';
import { orderSlice } from '../orderSlice/orderSlice';
import { ordersSlice } from '../ordersSlice/ordersSlice';

const rootReducer = combineReducers({
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [burgerConstructorSlice.name]: burgerConstructorSlice.reducer,
  [feedSlice.name]: feedSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [ordersSlice.name]: ordersSlice.reducer
});

const setupStore = () => configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

describe('Redux Store Configuration', () => {
  it('Правильная комбинация всех редьюсеров', () => {
    const store = setupStore();
    const state = store.getState();
    
    expect(state).toHaveProperty(ingredientsSlice.name);
    expect(state).toHaveProperty(userSlice.name);
    expect(state).toHaveProperty(burgerConstructorSlice.name);
    expect(state).toHaveProperty(feedSlice.name);
    expect(state).toHaveProperty(orderSlice.name);
    expect(state).toHaveProperty(ordersSlice.name);
  });

  it('Правильная инициализация начального состояния', () => {
    const store = setupStore();
    const state = store.getState();

    expect(state[ingredientsSlice.name]).toEqual(ingredientsSlice.getInitialState());
    expect(state[userSlice.name]).toEqual(userSlice.getInitialState());
    expect(state[burgerConstructorSlice.name]).toEqual(burgerConstructorSlice.getInitialState());
    expect(state[feedSlice.name]).toEqual(feedSlice.getInitialState());
    expect(state[orderSlice.name]).toEqual(orderSlice.getInitialState());
    expect(state[ordersSlice.name]).toEqual(ordersSlice.getInitialState());
  });
});
