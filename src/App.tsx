import React from 'react';
import '@inrupt/solid-style-guide';
import $rdf from 'rdflib';
import { createBrowserHistory } from 'history';
import './App.css';
import { ResourceLoader } from './components/ResourceLoader';
import { ProfileButton } from './components/styleguide/ProfileButton';
import { DataBrowserContextData, DataBrowserContext } from './context';
import { usePodOrigin } from './hooks/usePodOrigin';
import { Loading } from './components/Loading';
import { Connect } from './components/Connect';

const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store, undefined);
const history = createBrowserHistory();

const App: React.FC = () => {
  const podOrigin = usePodOrigin(store, fetcher);
  const [resourcePath, setResourcePath] = React.useState();
  const [resource, setResource] = React.useState<$rdf.NamedNode>();

  React.useEffect(
    () => {
      setResource(undefined);
      // The path initialises to undefined while we're not sure to which server we're talking:
      if (!resourcePath) { return; }
      const newResource = $rdf.sym(resourcePath);
      fetcher.load(newResource).then((_response: any) => {
        setResource(newResource);
      });
    },
    [resourcePath],
  );

  React.useEffect(() => {
    if (!podOrigin) {
      return;
    }
    // When initialising the data browser, load the resource at the current URL:
    const initialResourcePath = podOrigin + normalisePath(document.location.pathname) + document.location.search + document.location.hash;
    setResourcePath(initialResourcePath);

    const unlisten = history.listen((newLocation) => {
      setResourcePath(podOrigin + normalisePath(newLocation.pathname) + newLocation.search + newLocation.hash);
    })

    return unlisten;
  }, [podOrigin]);

  const loadResource = (resourcePath: string) => {
    const url = new URL(resourcePath);
    const basename = process.env.REACT_APP_BASENAME || '';
    history.push(basename + url.pathname + url.search + url.hash);
  }

  if (typeof podOrigin === 'undefined') {
    return (<Loading/>);
  }
  if (podOrigin === null) {
    return (
      <>
        <section className="banner banner-wrap--error">
          <div className="banner-wrap__content">Could not find a Pod to browse.</div>
        </section>
        <Connect/>
      </>
    );
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

function normalisePath(path: string): string {
  const basename = process.env.REACT_APP_BASENAME;

  if (!basename || path.substring(0, basename.length) !== basename) {
    return path;
  }

  // Make sure that the resulting path starts with a slash if the input did as well:
  const rest = path.substring(basename.length);
  return (path.charAt(0) === '/' && rest.charAt(0) !== '/')
    ? `/${rest}`
    : rest;
}

export default App;
