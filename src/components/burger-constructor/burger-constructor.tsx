import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store/store';
import { useNavigate } from 'react-router-dom';
import { userSelectors } from '../../services/userSlice/userSlice';
import {
  BurgerConstructorActions,
  orderBurger
} from '../../services/burgerConstuctorSlice/burgerConstructorSlice';
import { RequestStatus } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(userSelectors.getUser);

  const constructorItems = useSelector((state) => state.burgerConstructor);

  const orderRequest =
    useSelector((state) => state.burgerConstructor.requestStatus) ===
    RequestStatus.Loading;

  const orderModalData = useSelector((state) => state.burgerConstructor.order);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigation('/login');
    } else {
      const ingredientIds = [
        ...constructorItems.ingredients.map((ingredient) => ingredient._id),
        constructorItems.bun._id
      ];
      dispatch(orderBurger(ingredientIds));
    }
  };

  const closeOrderModal = () => {
    dispatch(BurgerConstructorActions.resetBurgerConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
