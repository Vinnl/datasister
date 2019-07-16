import React from 'react';
import $rdf from 'rdflib';
import Pixolid from './Apps/pixolid.svg';
import { usePodOrigin } from '../hooks/usePodOrigin';
import { DataBrowserContext } from '../context';
import { useWebId } from '@solid/react';
import { fetchTrustedApps } from '../panes/profile/preferences/trustedApplications/service';

export const AppsWidget: React.FC = () => {
  const { store, fetcher } = React.useContext(DataBrowserContext);
  const podOrigin = usePodOrigin(store, fetcher);
  const webId = useWebId();

  const trustedApps = (webId)
    ? fetchTrustedApps(store, $rdf.sym(webId))
    : [];

  if (trustedApps.length === 0) {
    const appLink = getAppLink('https://pixolid.netlify.com/', podOrigin);
    return (
      <div className="card">
        <section className="section">
          <h2 className="title">Try this app</h2>
          <p className="has-text-centered">
            <a href={appLink} title="Open Pixolid">
              <img src={Pixolid} alt="" style={{display: 'inline-block', margin: '0 10%', maxWidth: '80%'}}/>
            </a>
          </p>
        </section>
      </div>
    );
  }

  const appButtons = trustedApps.map((app) => {
    const shortName = (new URL(app.origin)).hostname;
    return (
      <li key={app.origin}>
        <a href={getAppLink(app.origin, podOrigin)}>{shortName}</a>
      </li>
    );
  });

  return (
    <div className="card">
      <section className="section">
        <h2 className="title">Your apps</h2>
        <div className="menu">
          <ul className="menu-list">
            {appButtons}
          </ul>
        </div>
      </section>
    </div>
  );
}

function getAppLink(appOrigin: string, podOrigin: string | undefined | null) {
  if (!podOrigin) {
    return appOrigin;
  }

  const newUrl = new URL(appOrigin);
  newUrl.searchParams.set('idp', podOrigin);
  return newUrl.href;
}
