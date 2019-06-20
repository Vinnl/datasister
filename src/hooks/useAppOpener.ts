import React from 'react';
import $rdf, { IndexedFormula, Fetcher, UpdateManager } from 'rdflib';
import { useWebId } from '@solid/react';
import { namespaces as ns } from '../namespace';

type Mode = 'Read' | 'Append' | 'Write' | 'Control';
type OpenApp = (origin: string, modes: Mode[], podOrigin?: string) => Promise<boolean>;
type UseAppOpener = (store: IndexedFormula, fetcher: Fetcher, updater: UpdateManager) => [boolean, OpenApp];
export const useAppOpener: UseAppOpener = (store, fetcher, updater) => {
  const [opening, setOpening] = React.useState(false);
  const webId = useWebId();

  const openApp: OpenApp = async (origin, modes, podOrigin) => {
    if (!webId || !podOrigin) {
      return false;
    }
    setOpening(true);

    const profileNode = $rdf.sym(webId);
    await fetcher.load(profileNode.doc());
    const [appStatement] = store.statementsMatching(null, ns.acl('origin'), origin as any, profileNode.doc());
    const originSlug = (new URL(origin)).hostname.replace(/\./g, '_');
    const appNode = (appStatement) ? appStatement.subject : new $rdf.BlankNode(originSlug);
    const newModes = modes.filter(mode => !store.holds(appNode, ns.acl('mode'), ns.acl(mode), profileNode.doc()));

    const statementsToAdd = newModes.map((mode) => {
      return $rdf.st(appNode, ns.acl('mode'), ns.acl(mode), profileNode.doc());
    });
    const trustStatement = $rdf.st(profileNode, ns.acl('trustedApp'), appNode, profileNode.doc());
    if (!store.holdsStatement(trustStatement)) {
      statementsToAdd.push(trustStatement);
    }
    if (!appStatement) {
      statementsToAdd.push($rdf.st(appNode, ns.acl('origin'), origin, profileNode.doc()))
    }
    const updatePromise = new Promise((resolve) => {
      updater.update([], statementsToAdd, (uri, success, errorBody) => resolve(success));
    })
    const updateSuccess = await updatePromise;
    if (updateSuccess) {
      const redirectTarget = new URL(origin);
      redirectTarget.searchParams.append('idp', encodeURI(podOrigin));
      document.location.assign(redirectTarget.href);

    }

    return false;
  };

  return [opening, openApp];
}
