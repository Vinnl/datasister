import React from 'react';
import { NamedNode, IndexedFormula } from 'rdflib';
import { namespaces as ns, aliases } from '../namespace';
import { DataBrowserContext } from '../context';

interface OwnProps {
  resource: NamedNode;
};

type Props = Omit<React.HTMLAttributes<HTMLAnchorElement>, keyof OwnProps> & OwnProps;

export const ResourceLink: React.FC<Props> = (props) => {
  const { store, loadResource, podOrigin } = React.useContext(DataBrowserContext);
  const clickHandler = (event: React.MouseEvent) => {
    if (props.resource.uri.substring(0, podOrigin.length) === podOrigin) {
      event.preventDefault();
      loadResource(props.resource.uri);
    }
  }

  const children = (props.children)
    ? props.children
    : getShorthand(props.resource, store, podOrigin);

  if (!props.title) {
    props.title = (typeof children === 'string')
      ? `View ${children}`
      : `View ${getShorthand(props.resource, store, podOrigin)}`
  }

  const anchorProps = {
    ...props,
    resource: undefined,
  };

  return (
    <a
      {...anchorProps}
      href={props.resource.uri}
      onClick={clickHandler}
    >
      {children}
    </a>
  );
};

function getShorthand(resource: NamedNode, store: IndexedFormula, podOrigin: string): string {
  const [nameStatement] = store.statementsMatching(resource, ns.foaf('name'), null, null, true);
  if (nameStatement && nameStatement.object) {
    return nameStatement.object.value;
  }

  if (resource.value.substring(0, podOrigin.length) === podOrigin) {
    const url = (resource.value.charAt(resource.value.length - 1) === '/')
      ? resource.value.substring(0, resource.value.length - 1)
      : resource.value;
    return url.substring(url.lastIndexOf('/') + 1);
  }

  for(const namespace of Object.values(aliases)) {
    if (resource.value.substring(0, namespace.length).toLowerCase() === namespace.toLowerCase()) {
      return resource.value.substring(namespace.length);
    }
  }

  return resource.value;
}
