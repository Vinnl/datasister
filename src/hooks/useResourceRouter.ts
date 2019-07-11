import React from 'react';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

type UseResourceRouter = (podOrigin: string | null | undefined) => string | undefined;
export const useResourceRouter: UseResourceRouter = (podOrigin) => {
  const [resourcePath, setResourcePath] = React.useState();

  React.useEffect(() => {
    if (!podOrigin) {
      return;
    }
    // When initialising the data browser, load the resource at the current URL:
    const queryParams = new URL(document.location.href).searchParams;
    const resourceParam = queryParams.get('resource');
    const initialResource = resourceParam ? decodeURI(resourceParam) : podOrigin;
    setResourcePath(initialResource);

    const unlisten = history.listen((newLocation) => {
      const newLocationParams = new URLSearchParams(newLocation.search);
      setResourcePath(decodeURI(newLocationParams.get('resource') || podOrigin));
    })

    return unlisten;
  }, [podOrigin]);

  return resourcePath;
}

export function loadResource (resourcePath: string): void {
  const basename = document.location.origin + (process.env.REACT_APP_BASENAME || '/');
  const newLocation = new URL(basename);
  newLocation.search = `?resource=${encodeURI(resourcePath)}`;
  history.push(newLocation.pathname + newLocation.search + newLocation.hash);
}
