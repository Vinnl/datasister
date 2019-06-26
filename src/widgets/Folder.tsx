import React from 'react';
import $rdf from 'rdflib';
import { ResourceLink } from '../components/ResourceLink';
import { usePodOrigin } from '../hooks/usePodOrigin';
import { DataBrowserContext } from '../context';

export const FolderWidget: React.FC = () => {
  const { store, fetcher } = React.useContext(DataBrowserContext);
  const podOrigin = usePodOrigin(store, fetcher);

  if (!podOrigin) {
    return null;
  }

  return (
    <div className="card">
      <h2>Raw data</h2>
      <p>
        <ResourceLink className="ids-link-filled ids-link-filled--primary" resource={$rdf.sym(`${podOrigin}/public/`)}>Public data</ResourceLink>
        <ResourceLink className="ids-button" resource={$rdf.sym(`${podOrigin}/private/`)}>Private data</ResourceLink>
      </p>
    </div>
  );
}
