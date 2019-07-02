import React from 'react';
import $rdf from 'rdflib';
import { PaneLoader } from './PaneLoader';
import { Loading } from './Loading';
import { canHandle as isContainer } from '../panes/folder/matcher';
import { canHandle as isProfile } from '../panes/profile/matcher';
import { DataBrowserContext } from '../context';

interface Props {
  resource?: $rdf.NamedNode;
};

export const ResourceLoader: React.FC<Props> = (props) => {
  const { store } = React.useContext(DataBrowserContext);

  if (!props.resource) {
    return <Loading/>;
  }

  let pane: string | undefined = undefined;

  if (isContainer(props.resource, store)) {
    pane = 'folder';
  }
  if (isProfile(props.resource, store)) {
    pane = 'profile';
  }

  if (typeof pane === 'undefined') {
    pane = 'fallback';
  }

  return (
    <PaneLoader
      pane={pane}
      resource={props.resource}
    />
  );
}
