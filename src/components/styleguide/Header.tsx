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

  // Unfortunately, the style guide does not display the logo without an explicit height:
  const logo = <img src={Logo} style={{height: '25px'}} alt="Data Browser"/>;
  const logoLink = (podOrigin)
    ? <ResourceLink resource={$rdf.sym(podOrigin)} className="navbar-item">{logo}</ResourceLink>
    : logo;

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-brand">
          {logoLink}
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            <LoggedIn>
              <div className="navbar-item">
                <ProfileButton className="button is-text"/>
              </div>
              <div className="navbar-item">
                <LogoutButton className="button"/>
              </div>
            </LoggedIn>
            <LoggedOut>
              <div className="navbar-item">
                <LoginButton popup="popup.html" className="button"/>
              </div>
            </LoggedOut>
          </div>
        </div>
      </nav>
    </header>
  );
}
