import React from 'react';
import { Statement } from 'rdflib';
import { namespaces as ns } from '../namespace';

interface Props {
  profileStatements: Statement[];
};

export const ProfileCard: React.FC<Props> = (props) => {
  const profile = getProfile(props.profileStatements);
  const photo = profile.photo ? <img src={profile.photo} alt={profile.name || ''}/> : null;

  return (
    <div className="card">
      <h2>{profile.name || 'Anonymous'}</h2>
      {photo}
      <p>
        {profile.role} {(profile.role && profile.organization) ? ' at ' : null} {profile.organization}
      </p>
    </div>
  );
};

interface ProfileFields {
  name: string;
  photo: string;
  organization: string;
  role: string;
};
function getProfile(statements: Statement[]): Partial<ProfileFields> {
  const profile = statements.reduce(
    (soFar, statement) => {
      if (statement.predicate.value === ns.foaf('name').value) {
        soFar.name = statement.object.value;
      } else if (statement.predicate.value === ns.vcard('hasPhoto').value) {
        soFar.photo = statement.object.value;
      } else if (statement.predicate.value === ns.vcard('organization-name').value) {
        soFar.organization = statement.object.value;
      } else if (statement.predicate.value === ns.vcard('role').value) {
        soFar.role = statement.object.value;
      }

      return soFar;
    },
    {} as Partial<ProfileFields>,
  );

  return profile;
}
