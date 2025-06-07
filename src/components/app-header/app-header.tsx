import React, { FC } from 'react';
import { useSelector } from '../../services/store/store';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const userName = useSelector((state) => state.user.data?.name);
  return <AppHeaderUI userName={userName} />;
};
