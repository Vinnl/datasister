import React from 'react';
import { useWebId, LoggedIn } from '@solid/react';
import { PaneContainer, PaneContainerProps } from '../../components/PaneLoader';
import { ProfileCard } from '../../components/ProfileCard';
import { Preferences } from './preferences/preferences';

type Views = 'view' | 'preferences';
export const Container: PaneContainer = (props) => {
  const [view, setView] = React.useState<Views>('view');

  function getMenuHandler(forView: Views) {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();

      setView(forView);
    };
  }
  return (
    <div className="columns">
      <div className="column">
        <section className="section">
          <MainItem {...props} view={view}/>
        </section>
      </div>
      <LoggedIn>
        <aside className="column is-one-quarter">
          <div className="section">
            <div className="menu">
              <ul className="menu-list">
                <li>
                  <a
                    // TODO: When we have a router, add an actual route to link to
                    href="#profile"
                    onClick={getMenuHandler('view')}
                  >Profile</a>
                </li>
                <li>
                  <a
                    // TODO: When we have a router, add an actual route to link to
                    href="#trustedApps"
                    onClick={getMenuHandler('preferences')}
                  >Applications</a>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </LoggedIn>
    </div>
  );
};

const MainItem: React.FC<PaneContainerProps & { view: Views }> = (props) => {
  if (props.view === 'preferences') {
    return (
      <Preferences
        store={props.store}
        updater={props.updater}
        profile={props.resource}
      />
    );
  }

  const profileStatements = props.store.statementsMatching(props.resource, null, null, props.resource.doc());

  return (
    <ProfileCard profileStatements={profileStatements}/>
  );
}
