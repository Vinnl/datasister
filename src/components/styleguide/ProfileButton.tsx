import React from 'react';
import $rdf from 'rdflib';
import Icon from './user.svg';
import { useWebId } from '@solid/react';
import { ResourceLink } from '../ResourceLink';

export const ProfileButton: React.FC = () => {
  const webId = useWebId();

  if (!webId) {
    return null;
  }

  return (
      <ResourceLink
        resource={$rdf.sym(webId)}
        title="View your profile"
      >
        <span className="icon"><img src={Icon} alt="View your profile"/></span>
      </ResourceLink>
  );
};
