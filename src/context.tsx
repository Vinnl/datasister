import React from 'react';
import $rdf, { IndexedFormula, Fetcher } from 'rdflib';

export interface DataBrowserContextData {
  store: IndexedFormula;
  fetcher: Fetcher;
  podOrigin: string;
  loadResource: (resourcePath: string) => void;
};

const defaultContext: DataBrowserContextData = {
  podOrigin: document.location.origin,
  store: $rdf.graph(),
  fetcher: new Fetcher($rdf.graph(), undefined),
  loadResource: () => undefined,
};

/**
 * The context allows the data browser to easily access global values
 * everywhere in the application.
 * Individual Panes, however, should get these values as properties,
 * to avoid a hard dependency on the data browser.
 * This will allow them to be used as e.g. individual apps or in browser extensions.
 */
export const DataBrowserContext = React.createContext(defaultContext);
