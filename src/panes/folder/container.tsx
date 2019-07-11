import React from 'react';
import { namespaces as ns } from '../../namespace';
import { PaneContainer } from '../../components/PaneLoader';
import { ResourceLink } from '../../components/ResourceLink';
import { NamedNode } from 'rdflib';

export const Container: PaneContainer = (props) => {
  const contents = props.store.statementsMatching(props.resource, ns.ldp('contains'), null, null);

  if (contents.length === 0) {
    return (
      <section className="section">
        <div className="message is-info">
          <p className="message-body">This container is empty.</p>
        </div>
      </section>);
  }

  const cards = contents.map((statement) => {
    return (
      <div key={statement.object.value} className="column">
        <div className="card has-text-centered">
          <p className="section">
            <ResourceLink
              resource={statement.object as NamedNode}
              className="button is-text"
            />
          </p>
        </div>
      </div>
    );
  });
  
  return (
    <section className="section">
      <div className="columns">
        {cards}
      </div>
    </section>
  );
};
