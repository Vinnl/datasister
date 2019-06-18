import React from 'react';
import { useWebId } from '@solid/react';
import $rdf from 'rdflib';
import { namespaces as ns } from '../namespace';

export const usePodOrigin = (store: $rdf.IndexedFormula, fetcher: $rdf.Fetcher) => {
  const [podOrigin, setPodOrigin] = React.useState(process.env.REACT_APP_POD_ORIGIN || document.location.origin);
  const webId = useWebId();

  React.useEffect(() => {
    if (!process.env.REACT_APP_REMOTE || process.env.REACT_APP_REMOTE !== 'true') {
      // The above flag should explicitly be set if we're not running on a pod server.
      // This saves us some unnecessary HTTP requests.
      return;
    }
    
    isPodServer(podOrigin)
    .then((isPodOriginAPodServer) => {
      if (isPodOriginAPodServer || !webId) {
        return;
      }
      const profile = $rdf.sym(webId);
      fetcher.load(profile).then(() => {
        const [storageStatement] = store.statementsMatching(profile, ns.space('storage'), null, profile.doc(), true);
        if (storageStatement) {
          setPodOrigin(storageStatement.object.value);
        }
      });
    });
  }, [podOrigin, webId, fetcher, store]);

  return podOrigin;
}

async function isPodServer(origin: string): Promise<boolean> {
  try {
    const response = await fetch(origin, { headers: { 'Content-Type': 'text/turtle' } });
    const contentType = response.headers.get('Content-Type');
    return contentType !== null && contentType.toLowerCase() === 'text/turtle';
  } catch (e) {
    return false;
  }
}
