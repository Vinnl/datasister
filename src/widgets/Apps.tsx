import React from 'react';
import Pixolid from './Apps/pixolid.svg';
import { usePodOrigin } from '../hooks/usePodOrigin';
import { DataBrowserContext } from '../context';

export const AppsWidget: React.FC = () => {
  const { store, fetcher } = React.useContext(DataBrowserContext);
  const podOrigin = usePodOrigin(store, fetcher);

  const appLink = (podOrigin)
    ? `https://pixolid.netlify.com/?idp=${podOrigin}`
    : 'https://pixolid.netlify.com/';

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
