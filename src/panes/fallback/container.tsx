import React from 'react';
import $rdf from 'rdflib';
import { PaneContainer } from '../../components/PaneLoader';

export const Container: PaneContainer = (props) => {
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
    <section>
      <p>Unfortunately we do not yet have a Pane to display this type of resource.</p>
      <p>You can see the raw document below:</p>
      <p>
        <textarea
          value={serialised}
          name="rawDocument"
          id="rawDocument"
          cols={30}
          rows={10}
          readOnly
        />
      </p>
    </section>
  );
};
