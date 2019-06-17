import React from 'react';
import { namespaces as ns } from '../../namespace';
import { PaneContainer } from '../../components/PaneLoader';
import { ResourceLink } from '../../components/ResourceLink';
import { NamedNode } from 'rdflib';

export const Container: PaneContainer = (props) => {
  const contents = props.store.statementsMatching(props.resource, ns.ldp('contains'), null, null);

  if (contents.length === 0) {
    return (<section><p>This container is empty&hellip;</p></section>);
  }

  const cards = contents.map((statement) => {
    return (
      <div className="card">
        <ResourceLink
          resource={statement.object as NamedNode}
          store={props.store}
          loadResource={props.loadResource}
        />
      </div>
    );
  });
  
  return (
    <section className="grid grid__four-column">
      {cards}
    </section>
  );
};
