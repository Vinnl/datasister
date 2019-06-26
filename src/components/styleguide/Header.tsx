import React from 'react';
import $rdf from 'rdflib';
import Logo from './logo.svg';
import { ProfileButton } from './ProfileButton';
import { LoggedIn, LogoutButton, LoggedOut, LoginButton } from '@solid/react';
import { DataBrowserContext } from '../../context';
import { usePodOrigin } from '../../hooks/usePodOrigin';
import { ResourceLink } from '../ResourceLink';

export const Header: React.FC = () => {
  const { store, fetcher } = React.useContext(DataBrowserContext);
  const podOrigin = usePodOrigin(store, fetcher);

  const logo = <img src={Logo} style={{height: '25px'}} alt="Data Browser"/>;
  const logoLink = (podOrigin)
    ? <ResourceLink resource={$rdf.sym(podOrigin)}>{logo}</ResourceLink>
    : logo;

  return (
    <header className="header fixed">
      <div className="header-wrap">
        <div className="logo-block">
          <h1>
            {/* Unfortunately, the style guide does not display the logo without an explicit height: */}
            {logoLink}
          </h1>
        </div>
        <nav className="nav nav__toolbar">
          <ul>
            <LoggedIn>
              <li>
                <ProfileButton/>
              </li>
              <li>
                  <LogoutButton/>
              </li>
            </LoggedIn>
            <LoggedOut>
              <li>
                <LoginButton popup="popup.html"/>
              </li>
            </LoggedOut>
          </ul>
        </nav>
      </div>
    </header>
  );
}
