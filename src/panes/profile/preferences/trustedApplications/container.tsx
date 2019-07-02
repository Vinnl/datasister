import React from 'react';
import $rdf, { NamedNode, IndexedFormula, UpdateManager } from 'rdflib';
import { TrustedApplication, Mode } from './model';
import { fetchTrustedApps, getStatementsToAdd, getStatementsToDelete } from './service';
import { View } from './view';

interface Props {
  profile: NamedNode;
  store: IndexedFormula;
  updater: UpdateManager;
};

export const TrustedApplications: React.FC<Props> = (props) => {
  const fetchedTrustedApps: TrustedApplication[] = fetchTrustedApps(props.store, props.profile);

  const [trustedApps, setTrustedApps] = React.useState(fetchedTrustedApps);

  const isEditable: boolean = (props.updater as any).editable(props.profile.doc().uri, props.store);
  if (!isEditable) {
    return <div>Your profile {props.profile.doc().uri} is not editable, so we cannot do much here.</div>;
  }

  const addOrEditApp = (origin: string, modes: Mode[]) => {
    const result = new Promise<void>((resolve) => {
      const deletions = getStatementsToDelete($rdf.sym(origin), props.profile, props.store);
      const additions = getStatementsToAdd($rdf.sym(origin), generateRandomString(), modes, props.profile);
      props.store.updater!.update(deletions, additions, () => {
        const newApp: TrustedApplication = { subject: props.profile.value, origin, modes };
        setTrustedApps(insertTrustedApp(newApp, trustedApps));
        resolve();
      })
    })

    return result;
  }

  const deleteApp = (origin: string) => {
    const result = new Promise<void>((resolve) => {
      const deletions = getStatementsToDelete($rdf.sym(origin), props.profile, props.store);
      props.store.updater!.update(deletions, [], () => {
        setTrustedApps(removeTrustedApp(origin, trustedApps));
        resolve();
      })
    })

    return result;
  }

  return (
    <section>
      <View
        apps={trustedApps}
        onSaveApp={addOrEditApp}
        onDeleteApp={deleteApp}
      />
    </section>
  )
}

function insertTrustedApp (app: TrustedApplication, into: TrustedApplication[]): TrustedApplication[] {
  const index = into.findIndex(found => found.origin === app.origin)
  if (index === -1) {
    return into.concat(app)
  }

  return into.slice(0, index)
    .concat(app)
    .concat(into.slice(index + 1))
}
function removeTrustedApp (origin: string, from: TrustedApplication[]): TrustedApplication[] {
  const index = from.findIndex(found => found.origin === origin)
  return (index === -1)
    ? from
    : from.slice(0, index).concat(from.slice(index + 1))
}

function generateRandomString (): string {
  return Math.random().toString(36).substring(7)
}
