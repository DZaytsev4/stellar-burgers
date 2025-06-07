import React, { useEffect } from 'react';
import { useLocation, useMatch } from 'react-router-dom';
import { ConstructorPage } from '@pages';
import { Feed } from '@pages';
import { NotFound404 } from '@pages';
import { Login } from '@pages';
import { Register } from '@pages';
import { ForgotPassword } from '@pages';
import { ResetPassword } from '@pages';
import { Profile } from '@pages';
import { ProfileOrders } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';
import { AppHeader, OrderStatus } from '@components';
import { Modal } from '@components';
import { OrderInfo } from '@components';
import { IngredientDetails } from '@components';
import { ProtectedRoute } from '../protected-route/ProtectedRoute';
import { useDispatch } from '../../services/store/store';
import { getIngredients } from '../../services/ingredientsSlice/ingredientsSlice';
import { checkUserAuth, userActions } from '../../services/userSlice/userSlice';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleModalIngredientClose = () => {
    navigate('./');
  };
  const handleFeedModalClose = () => {
    navigate('./feed');
  };

  const handleProfileOrdersModalClose = () => {
    navigate('./profile/orders');
  };

  const profileOrderMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedOrderMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileOrderMatch || feedOrderMatch;

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(checkUserAuth()).finally(() => dispatch(userActions.authCheck()));
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/feed/:number'
          element={
            <div className={styles.detailPageWrap}>
              <p
                className={`text text_type_digits-default ${styles.detailHeader}`}
              >
                #${orderNumber && orderNumber.padStart(6, '0')}
              </p>
              <OrderStatus status={''} />
              <OrderInfo />
            </div>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <div className={styles.detailPageWrap}>
                <p
                  className={`text text_type_digits-default ${styles.detailHeader}`}
                >
                  #${orderNumber && orderNumber.padStart(6, '0')}
                </p>
                <OrderInfo />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
                onClose={handleFeedModalClose}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={handleModalIngredientClose}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
                  onClose={handleProfileOrdersModalClose}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
