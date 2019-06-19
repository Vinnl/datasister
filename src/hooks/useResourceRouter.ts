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
    const initialResourcePath = podOrigin + normalisePath(document.location.pathname) + document.location.search + document.location.hash;
    setResourcePath(initialResourcePath);

    const unlisten = history.listen((newLocation) => {
      setResourcePath(podOrigin + normalisePath(newLocation.pathname) + newLocation.search + newLocation.hash);
    })

    return unlisten;
  }, [podOrigin]);

  return resourcePath;
}

export function loadResource (resourcePath: string): void {
  const url = new URL(resourcePath);
  const basename = process.env.REACT_APP_BASENAME || '';
  history.push(basename + url.pathname + url.search + url.hash);
}

function normalisePath(path: string): string {
  const basename = process.env.REACT_APP_BASENAME;

  if (!basename || path.substring(0, basename.length) !== basename) {
    return path;
  }

  // Make sure that the resulting path starts with a slash if the input did as well:
  const rest = path.substring(basename.length);
  return (path.charAt(0) === '/' && rest.charAt(0) !== '/')
    ? `/${rest}`
    : rest;
}
