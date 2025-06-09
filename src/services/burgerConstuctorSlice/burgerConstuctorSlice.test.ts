import burgerConstructorReducer, {
    BurgerConstructorActions,
    TConstructorState,
    initialState
  } from './burgerConstructorSlice';
  import { TConstructorIngredient, TIngredient } from '@utils-types';
  
  describe('burgerConstructorSlice', () => {
  
    const testIngredient: TIngredient = {
      _id: '1',
      name: 'Test Ingredient',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 50,
      image: 'test-image-url',
      image_mobile: 'test-image-url',
      image_large: 'test-image-url',
    };
  
    const testConstructorIngredient: TConstructorIngredient = {
      ...testIngredient,
      id: 'unique-id'
    };
  
    const bunIngredient: TIngredient = {
      ...testIngredient,
      type: 'bun'
    };

    test('Добавление булки в конструктор', () => {
      const action = BurgerConstructorActions.addToBurgerConstructor(bunIngredient);
      const state = burgerConstructorReducer(initialState, action);
      expect(state.bun).toEqual(expect.objectContaining({
        ...bunIngredient,
        id: expect.any(String)
      }));
    });

    test('Добавление ингредиента в конструктор', () => {
      const action = BurgerConstructorActions.addToBurgerConstructor(testIngredient);
      const state = burgerConstructorReducer(initialState, action);
      expect(state.ingredients.length).toBe(1);
      expect(state.ingredients[0]).toEqual(expect.objectContaining({
        ...testIngredient,
        id: expect.any(String)
      }));
    });
    
    test('Удаление ингредиента', () => {
      const preloadedState: TConstructorState = {
        ...initialState,
        ingredients: [testConstructorIngredient]
      };
      const action = BurgerConstructorActions.removeFromBurgerConstructor('unique-id');
      const state = burgerConstructorReducer(preloadedState, action);
      expect(state.ingredients.length).toBe(0);
    });
  
    test('Изменение порядка расположения ингредиента', () => {
      const ingredient1: TConstructorIngredient = {
        ...testIngredient,
        id: 'unique-id-1'
      };
  
      const ingredient2: TConstructorIngredient = {
        ...testIngredient,
        id: 'unique-id-2'
      };
  
      const preloadedState: TConstructorState = {
        ...initialState,
        ingredients: [ingredient1, ingredient2]
      };
  
      const action = BurgerConstructorActions.reorderBurgerConstructor({ from: 0, to: 1 });
      const state = burgerConstructorReducer(preloadedState, action);
      expect(state.ingredients[0]).toEqual(expect.objectContaining(ingredient2));
      expect(state.ingredients[1]).toEqual(expect.objectContaining(ingredient1));
  
      const actionReverse = BurgerConstructorActions.reorderBurgerConstructor({ from: 1, to: 0 });
      const stateReverse = burgerConstructorReducer(state, actionReverse);
  
      expect(stateReverse.ingredients[0]).toEqual(expect.objectContaining(ingredient1));
      expect(stateReverse.ingredients[1]).toEqual(expect.objectContaining(ingredient2));
    });
  });
  