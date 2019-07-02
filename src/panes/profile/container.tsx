import React from 'react';
import { PaneContainer } from '../../components/PaneLoader';
import { ProfileCard } from '../../components/ProfileCard';

export const Container: PaneContainer = (props) => {
  const profileStatements = props.store.statementsMatching(props.resource, null, null, props.resource.doc());

  return (
    <section className="section">
      <ProfileCard profileStatements={profileStatements}/>
    </section>
  );
};
