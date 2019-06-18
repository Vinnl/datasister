import React from 'react';
import '@inrupt/solid-style-guide';
import $rdf from 'rdflib';
import { createBrowserHistory } from 'history';
import './App.css';
import { ResourceLoader } from './components/ResourceLoader';
import { ProfileButton } from './components/styleguide/ProfileButton';
import { DataBrowserContextData, DataBrowserContext } from './context';

const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store, undefined);
const podOrigin = process.env.REACT_APP_POD_ORIGIN || document.location.origin;
const history = createBrowserHistory();

const App: React.FC = () => {
  const initialResourcePath = podOrigin + document.location.pathname + document.location.search + document.location.hash;
  const [resourcePath, setResourcePath] = React.useState(initialResourcePath);
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
    const unlisten = history.listen((newLocation) => {
      setResourcePath(podOrigin + newLocation.pathname + newLocation.search + newLocation.hash);
    })

    return unlisten;
  });

  const loadResource = (resourcePath: string) => {
    const url = new URL(resourcePath);
    history.push(url.pathname + url.search + url.hash);
  }
  const dataBrowserContext: DataBrowserContextData = { store, podOrigin, loadResource };

  return (
    <DataBrowserContext.Provider value={dataBrowserContext}>
      <div className="App">
        <header className="header fixed">
          <div className="header-wrap">
            <div className="logo-block">
              <h1>Data browser</h1>
            </div>
            <nav className="nav nav__toolbar">
              <ul>
                <li>
                  <ProfileButton/>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <div className="header-spacer"/>
        <Introduction resourcePath={resourcePath}/>
        <ResourceLoader resource={resource}/>
      </div>
    </DataBrowserContext.Provider>
  );
}

const Introduction: React.FC<{resourcePath: string}> = (props) => {
  const { podOrigin } = React.useContext(DataBrowserContext);

  if (props.resourcePath !== podOrigin && props.resourcePath !== podOrigin + '/') {
    return null;
  }

  return (
    <section>
      <article>
        <h2>This is your Pod</h2>
        <p>Here, you can browse through all data stored by apps you gave access to your Pod.</p>
      </article>
    </section>
  );
}

export default App;
