import React from 'react';
import { useWebId } from '@solid/react';
import { PaneContainer } from '../../components/PaneLoader';
import { ProfileCard } from '../../components/ProfileCard';
import { Preferences } from './preferences/preferences';

export const Container: PaneContainer = (props) => {
  const webId = useWebId();
  const [view, setView] = React.useState<'view' | 'preferences'>('view');
  const profileStatements = props.store.statementsMatching(props.resource, null, null, props.resource.doc());

  if (view === 'preferences') {
    return (
      <Preferences
        store={props.store}
        updater={props.updater}
        profile={props.resource}
      />
    );
  }

  const prefsButton = (webId && webId === props.resource.value)
    ? <p><button onClick={() => setView('preferences')}>Preferences</button></p>
    : null;

  return (
    <section className="section">
      <ProfileCard profileStatements={profileStatements}/>
      {prefsButton}
    </section>
  );
};
