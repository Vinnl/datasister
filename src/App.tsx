import React from 'react';
import '@inrupt/solid-style-guide';
import $rdf from 'rdflib';
import './App.css';
import { ResourceLoader } from './components/ResourceLoader';
import { DataBrowserContextData, DataBrowserContext } from './context';
import { usePodOrigin } from './hooks/usePodOrigin';
import { Loading } from './components/Loading';
import { Connect } from './components/Connect';
import { useResourceLoader } from './hooks/useResourceLoader';
import { useResourceRouter, loadResource } from './hooks/useResourceRouter';
import { Header } from './components/styleguide/Header';

const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store, undefined);

const App: React.FC = () => {
  const podOrigin = usePodOrigin(store, fetcher);
  const resourcePath = useResourceRouter(podOrigin);
  const resource = useResourceLoader(resourcePath, fetcher);

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
        <Header/>
        <div className="header-spacer"/>
        <Introduction resourcePath={resourcePath}/>
        <ResourceLoader resource={resource}/>
      </div>
    </DataBrowserContext.Provider>
  );
}

const Introduction: React.FC<{resourcePath: string | undefined}> = (props) => {
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
