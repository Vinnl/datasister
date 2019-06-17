import React from 'react';
import { NamedNode, IndexedFormula } from 'rdflib';
import { namespaces as ns, aliases } from '../namespace';

interface OwnProps {
  resource: NamedNode;
  store: IndexedFormula;
  loadResource: (resourcePath: string) => void;
};

type Props = Omit<React.HTMLAttributes<HTMLAnchorElement>, keyof OwnProps> & OwnProps;

export const ResourceLink: React.FC<Props> = (props) => {
  const clickHandler = (event: React.MouseEvent) => {
    if (props.resource.uri.substring(0, document.location.origin.length) === document.location.origin) {
      event.preventDefault();
      props.loadResource(props.resource.uri);
    }
  }
  const shorthand = getShorthand(props.resource, props.store);
  const anchorProps = {
    ...props,
    resource: undefined,
    store: undefined,
    loadResource: undefined,
  };

  return (
    <a
      {...anchorProps}
      href={props.resource.uri}
      onClick={clickHandler}
      title={`View ${shorthand}`}
    >
      {shorthand}
    </a>
  );
};

function getShorthand(resource: NamedNode, store: IndexedFormula): string {
  const [nameStatement] = store.statementsMatching(resource, ns.foaf('name'), null, null, true);
  if (nameStatement && nameStatement.object) {
    return nameStatement.object.value;
  }

  if (resource.value.substring(0, document.location.origin.length) === document.location.origin) {
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
