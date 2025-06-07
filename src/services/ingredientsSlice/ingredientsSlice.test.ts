import ingredientsReducer, { getIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';
import { RequestStatus } from '@utils-types';

describe('ingredientsSlice', () => {
  const initialState = {
    data: [],
    status: RequestStatus.Idle
  };

  const testIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Test Ingredient 1',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 50,
      image: 'test-image-url',
      image_mobile: 'test-image-url',
      image_large: 'test-image-url',
    },
    {
      _id: '2',
      name: 'Test Ingredient 2',
      type: 'sauce',
      proteins: 20,
      fat: 20,
      carbohydrates: 20,
      calories: 200,
      price: 100,
      image: 'test-image-url',
      image_mobile: 'test-image-url',
      image_large: 'test-image-url',
    }
  ];

  test('Обработка начального состояния', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('Обработка getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Loading);
  });

  test('Обработка getIngredients.fulfilled', () => {
    const action = { type: getIngredients.fulfilled.type, payload: testIngredients };
    const state = ingredientsReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Success);
    expect(state.data).toEqual(testIngredients);
  });

  test('Обработка getIngredients.rejected', () => {
    const action = { type: getIngredients.rejected.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Failed);
  });
});
