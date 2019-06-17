import React from 'react';
import '@inrupt/solid-style-guide';
import $rdf from 'rdflib';
import './App.css';
import { ResourceLoader } from './components/ResourceLoader';

const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store, undefined);

const App: React.FC = () => {
  const [resourcePath, setResourcePath] = React.useState<string>(document.location.href);
  const [resource, setResource] = React.useState<$rdf.NamedNode>();

  React.useEffect(
    () => {
      // TODO: Use the History API to change the document location as well,
      //       and track location changes to load other resources.
      setResource(undefined);
      const newResource = $rdf.sym(resourcePath);
      fetcher.load(newResource).then((_response: any) => {
        setResource(newResource);
      });
    },
    [resourcePath],
  );

  const loadResource = (resourcePath: string) => {
    setResourcePath(resourcePath);
  }

  return (
    <div className="App">
      <header>
        <h1>Data browser</h1>
      </header>
      <ResourceLoader
        loadResource={loadResource}
        store={store}
        resource={resource}
      />
    </div>
  );
}

export default App;
