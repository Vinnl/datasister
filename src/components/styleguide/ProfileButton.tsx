import React from 'react';
import $rdf from 'rdflib';
import Icon from './user.svg';
import { useWebId } from '@solid/react';
import { ResourceLink } from '../ResourceLink';

export const ProfileButton: React.FC<React.HTMLAttributes<HTMLAnchorElement>> = (props) => {
  const webId = useWebId();

  if (!webId) {
    return null;
  }

  return (
      <ResourceLink
        title="View your profile"
        {...props}
        resource={$rdf.sym(webId)}
      >
        <span className="icon"><img src={Icon} alt="View your profile"/></span>
      </ResourceLink>
  );
};
