import React from 'react';
import $rdf from 'rdflib';
import { PaneLoader } from './PaneLoader';
import { Loading } from './Loading';
import { canHandle as isContainer } from '../panes/folder/matcher';

interface Props {
  resource?: $rdf.NamedNode;
  store: $rdf.IndexedFormula;
  loadResource: (resourcePath: string) => void;
};

export const ResourceLoader: React.FC<Props> = (props) => {
  if (!props.resource) {
    return <Loading/>;
  }

  let pane: string | undefined = undefined;

  if (isContainer(props.resource, props.store)) {
    pane = 'folder';
  }

  if (typeof pane === 'undefined') {
    return (<div>Unfortunately we do not have a pane to display this type of resource.</div>);
  }

  return (
    <PaneLoader
      pane={pane}
      store={props.store}
      resource={props.resource}
      loadResource={props.loadResource}
    />
  );
}
