import React from 'react';
import { IndexedFormula, NamedNode, Statement } from 'rdflib';
import { ResourceLink } from '../../components/ResourceLink';

interface Props {
  resource: NamedNode;
  store: IndexedFormula;
  loadResource: (resourcePath: string) => void;
};

export const Resources: React.FC<Props> = (props) => {
  const statements = props.store.statementsMatching(null, null, null, props.resource.doc(), false);
  const statementsBySubject = statements.reduce(
    (soFar, statement) => {
      const subject = statement.subject.value;
      soFar[subject] = soFar[subject] || [];
      soFar[subject].push(statement);
      return soFar;
    },
    {} as {[subject: string]: Statement[]},
  );

  const rows = Object.values(statementsBySubject).map((subjectStatements) => {
    return subjectStatements.map((subjectStatement, index) => {
      return (
        <tr key={subjectStatement.subject + index.toString()}>
          <td>
            {(index === 0)
              ? <ResourceLink resource={subjectStatement.subject as NamedNode} store={props.store} loadResource={props.loadResource}/>
              : null
            }
          </td>
          <td>
            <ResourceLink
              resource={subjectStatement.predicate as NamedNode}
              store={props.store}
              loadResource={props.loadResource}
            />
          </td>
          <td>
            <ResourceLink
              resource={subjectStatement.object as NamedNode}
              store={props.store}
              loadResource={props.loadResource}
            />
          </td>
        </tr>
      );
    });
  });

  return (
    <div className="card">
      <table>{rows}</table>
    </div>
  );
};
