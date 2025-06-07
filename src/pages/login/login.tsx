import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store/store';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/userSlice/userSlice';
import { AppDispatch } from 'src/services/store/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
