import React from 'react';
import $rdf, { IndexedFormula } from 'rdflib';
import Icon from './user.svg';
import { useWebId } from '@solid/react';
import { ResourceLink } from '../ResourceLink';

interface Props {
  store: IndexedFormula;
  loadResource: (resourcePath: string) => void;
};

export const ProfileButton: React.FC<Props> = (props) => {
  const webId = useWebId();

  if (!webId) {
    return null;
  }

  return (
      <ResourceLink
        resource={$rdf.sym(webId)}
        store={props.store}
        loadResource={props.loadResource}
        title="View your profile"
      >
        <span className="icon"><img src={Icon} alt="View your profile"/></span>
      </ResourceLink>
  );
};
