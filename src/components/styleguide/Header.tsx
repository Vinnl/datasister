import React from 'react';
import Logo from './logo.svg';
import { ProfileButton } from './ProfileButton';

export const Header: React.FC = () => {
  return (
    <header className="header fixed">
      <div className="header-wrap">
        <div className="logo-block">
          <h1>
            {/* Unfortunately, the style guide does not display the logo without an explicit height: */}
            <img src={Logo} style={{height: '25px'}} alt="Data Browser"/>
          </h1>
        </div>
        <nav className="nav nav__toolbar">
          <ul>
            <li>
              <ProfileButton/>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
