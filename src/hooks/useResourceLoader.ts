import React from 'react';
import $rdf from 'rdflib';

type UseResourceLoader = (resourcePath: string | undefined, fetcher: $rdf.Fetcher) => $rdf.NamedNode | undefined;
export const useResourceLoader: UseResourceLoader = (resourcePath, fetcher) => {
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
    [resourcePath, fetcher],
  );

  return resource;
}
