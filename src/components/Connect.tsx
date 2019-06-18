import React from 'react';
import { LoginButton } from '@solid/react';

export const Connect: React.FC = () => {
  const basename = process.env.REACT_APP_BASENAME || '';
  return (
    <LoginButton popup={basename + '/popup.html'}>Log in</LoginButton>
  );
};
