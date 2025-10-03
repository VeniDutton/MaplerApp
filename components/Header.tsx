
import React from 'react';
import { APP_TITLE } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="bg-primary-dark text-white p-4 shadow-md">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
      </div>
    </header>
  );
};

export default Header;
