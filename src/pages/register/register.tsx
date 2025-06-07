import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store/store';
import { AppDispatch } from 'src/services/store/store';
import { registerUser } from '../../services/userSlice/userSlice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        registerUser({ email, name: userName, password })
      ).unwrap();
      navigate('/');
    } catch (error) {
      setErrorText('Регистрация не удалась');
      console.error('Ошибка при регистрации', error);
    }
  };

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
