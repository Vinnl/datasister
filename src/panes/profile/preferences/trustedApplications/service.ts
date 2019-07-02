import $rdf, { NamedNode, IndexedFormula, Statement } from 'rdflib'
import { namespaces as ns } from '../../../../namespace';
import { Mode, TrustedApplication } from './model'

export function getStatementsToDelete (
  origin: NamedNode,
  person: NamedNode,
  store: IndexedFormula,
) {
  const applicationStatements = store.statementsMatching(null, ns.acl('origin'), origin, null)
  const statementsToDelete = applicationStatements.reduce(
    (memo, st) => {
      return memo
        .concat(store.statementsMatching(person, ns.acl('trustedApp'), st.subject, null, false))
        .concat(store.statementsMatching(st.subject, null, null, null, false))
    },
    [] as Statement[]
  )
  return statementsToDelete
}

export function getStatementsToAdd (
  origin: NamedNode,
  nodeName: string,
  modes: Mode[],
  person: NamedNode,
) {
  var application = new $rdf.BlankNode(`bn_${nodeName}`)
  return [
    $rdf.st(person, ns.acl('trustedApp'), application, person.doc()),
    $rdf.st(application, ns.acl('origin'), origin, person.doc()),
    ...modes
      .map(mode => {
        return ns.acl(mode)
      })
      .map(mode => $rdf.st(application, ns.acl('mode'), mode, person.doc()))
  ]
}

/* istanbul ignore next [This executes the actual HTTP requests, which is too much effort to test.] */
export function fetchTrustedApps (
  store: $rdf.IndexedFormula,
  subject: $rdf.NamedNode,
): TrustedApplication[] {
  return (store.each(subject, ns.acl('trustedApp'), undefined, undefined) as any)
    .flatMap((app: $rdf.NamedNode) => {
      return store.each(app, ns.acl('origin'), undefined, undefined)
        .map((origin) => {
          const modes = store.each(app, ns.acl('mode'), undefined, undefined)
          const trustedApp: TrustedApplication = {
            origin: origin.value,
            subject: subject.value,
            modes: modes.map((mode) => deserialiseMode(mode as $rdf.NamedNode))
          }
          return trustedApp
        })
    })
    .sort((appA: TrustedApplication, appB: TrustedApplication) => (appA.origin > appB.origin) ? 1 : -1)
}

/**
 * @param serialisedMode The full IRI of a mode
 * @returns A plain text string representing that mode, i.e. 'Read', 'Append', 'Write' or 'Control'
 */
export function deserialiseMode (serialisedMode: $rdf.NamedNode): Mode {
  const deserialisedMode = serialisedMode.value
    .replace(ns.acl('Read').value, 'Read')
    .replace(ns.acl('Append').value, 'Append')
    .replace(ns.acl('Write').value, 'Write')
    .replace(ns.acl('Control').value, 'Control')

  return deserialisedMode as Mode
}
