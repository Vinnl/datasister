import React from 'react';
import $rdf, { IndexedFormula, NamedNode } from 'rdflib';

interface Props {
  resource: NamedNode;
  store: IndexedFormula;
};

export const Turtle: React.FC<Props> = (props) => {
  const [serialised, setSerialised] = React.useState<string>('Loading…');

  React.useEffect(() => {
    ($rdf as any).serialize(props.resource.doc(), props.store, undefined, 'text/turtle', (err: Error, result: string) => {
      if (!err) {
        setSerialised(result);
      } else {
        setSerialised('Error loading the raw document, please try refreshing the page.');
      }
    });
  });

  return (
    <textarea
      value={serialised}
      name="rawDocument"
      id="rawDocument"
      cols={30}
      rows={10}
      readOnly
    />
  );
};
