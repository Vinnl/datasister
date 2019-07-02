import React from 'react';
import { IndexedFormula, NamedNode, UpdateManager } from 'rdflib';
import { useWebId } from '@solid/react';
import { TrustedApplications } from './trustedApplications/container';

interface Props {
  store: IndexedFormula;
  updater: UpdateManager;
  profile: NamedNode;
};

export const Preferences: React.FC<Props> = (props) => {
  const webId = useWebId();

  if (!webId || webId !== props.profile.value) {
    return (
      <p>You can only set your own preferences.</p>
    );
  }

  return (
    <section className="section">
      <TrustedApplications
        store={props.store}
        updater={props.updater}
        profile={props.profile}
      />
    </section>
  );
};
