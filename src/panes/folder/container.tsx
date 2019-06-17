import React from 'react';
import { namespaces as ns } from '../../namespace';
import { PaneContainer } from '../../components/PaneLoader';

export const Container: PaneContainer = (props) => {
  const contents = props.store.statementsMatching(props.resource, ns.ldp('contains'), null, null);
  const cards = contents.map((statement) => {
    return (
      <div className="card">
        <a
          href={statement.object.value}
          onClick={(e) => {e.preventDefault(); props.loadResource(statement.object.value)}}
          title="View this data"
        >
          {statement.object.value}
        </a>
      </div>
    );
  });
  
  return (
    <div className="grid grid__four-column">
      {cards}
    </div>
  );
};
