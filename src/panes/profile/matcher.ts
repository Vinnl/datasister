import { IndexedFormula, NamedNode } from 'rdflib';
import { namespaces as ns } from '../../namespace';

export function canHandle(resource: NamedNode, store: IndexedFormula): boolean {
  return store.holds(resource, ns.rdf('type'), ns.foaf('Person'), resource.doc());
}
