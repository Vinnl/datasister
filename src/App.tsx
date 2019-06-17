import React from 'react';
import '@inrupt/solid-style-guide';
import $rdf from 'rdflib';
import { createBrowserHistory } from 'history';
import './App.css';
import { ResourceLoader } from './components/ResourceLoader';

const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store, undefined);
const history = createBrowserHistory();

const App: React.FC = () => {
  const [resourcePath, setResourcePath] = React.useState<string>(document.location.href);
  const [resource, setResource] = React.useState<$rdf.NamedNode>();

  React.useEffect(
    () => {
      setResource(undefined);
      const newResource = $rdf.sym(resourcePath);
      fetcher.load(newResource).then((_response: any) => {
        setResource(newResource);
      });
    },
    [resourcePath],
  );

  React.useEffect(() => {
    const unlisten = history.listen((location) => {
      setResourcePath(document.location.origin + location.pathname + location.search + location.hash);
    })

    return unlisten;
  });

  const loadResource = (resourcePath: string) => {
    const url = new URL(resourcePath);
    history.push(url.pathname + url.search + url.hash);
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
