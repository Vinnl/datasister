import React from 'react';
import { useWebId } from '@solid/react';
import $rdf from 'rdflib';
import { namespaces as ns } from '../namespace';

type UsePodOrigin = (store: $rdf.IndexedFormula, fetcher: $rdf.Fetcher) => string | undefined | null;
export const usePodOrigin: UsePodOrigin = (store, fetcher) => {
  const ownOrigin = process.env.REACT_APP_POD_ORIGIN || document.location.origin;
  if (!process.env.REACT_APP_REMOTE || process.env.REACT_APP_REMOTE !== 'true') {
    return ownOrigin;
  }

  // The conditional above gets compiled away to either `true` or `false`,
  // and hence the order of the hooks will remain consistent when built:
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [podOrigin, setPodOrigin] = React.useState<string | null>();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const webId = useWebId();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    // First check whether the server that hosts the Data Browser is a Pod server...
    isPodServer(ownOrigin)
    .then((isOwnOriginAPodServer) => {
      if (isOwnOriginAPodServer) {
        // ...if it is, we're good!
        setPodOrigin(ownOrigin);
        return;
      }
      if (typeof webId === 'undefined') {
        // ...otherwise, wait until we are logged in...
        return;
      }
      if (webId === null) {
        setPodOrigin(null);
        return;
      }
      // ...then check whether a Pod server is listed in the user's profile.
      const profile = $rdf.sym(webId);
      fetcher.load(profile)
      .then(() => {
        const [storageStatement] = store.statementsMatching(profile, ns.space('storage'), null, profile.doc(), true);
        if (storageStatement) {
          const url = new URL(storageStatement.object.value);
          setPodOrigin(url.origin);
        } else {
          setPodOrigin(null);
        }
      })
      .catch((e) => setPodOrigin(null));
    });
  }, [ownOrigin, webId, fetcher, store]);

  return podOrigin;
}

async function isPodServer(origin: string): Promise<boolean> {
  try {
    const response = await fetch(origin, { headers: { 'Content-Type': 'text/turtle' } });
    const contentType = response.headers.get('Content-Type');
    return response.ok && contentType !== null && contentType.toLowerCase() === 'text/turtle';
  } catch (e) {
    return false;
  }
}
