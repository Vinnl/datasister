import React from 'react';
import '@inrupt/solid-style-guide';
import $rdf from 'rdflib';
import { createBrowserHistory } from 'history';
import './App.css';
import { ResourceLoader } from './components/ResourceLoader';
import { ProfileButton } from './components/styleguide/ProfileButton';

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
      <header className="header fixed">
        <div className="header-wrap">
          <div className="logo-block">
            <h1>Data browser</h1>
          </div>
          <nav className="nav nav__toolbar">
            <ul>
              <li>
                <ProfileButton store={store} loadResource={loadResource}/>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="header-spacer"/>
      <ResourceLoader
        loadResource={loadResource}
        store={store}
        resource={resource}
      />
    </div>
  );
}

export default App;
