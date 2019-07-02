/* eslint-env jest */
import $rdf from 'rdflib';
import { getStatementsToDelete, getStatementsToAdd, deserialiseMode } from './service';
import { namespaces as ns } from '../../../../namespace';
import { Mode } from './model';

describe('getStatementsToDelete', () => {
  it('should return an empty array when there are no statements', () => {
    const mockStore = $rdf.graph()
    const mockOrigin = $rdf.sym('https://fake.origin')
    const mockProfile = $rdf.sym('https://fake.profile#me')
    expect(getStatementsToDelete(mockOrigin, mockProfile, mockStore)).toEqual([])
  })

  it('should return all statements for the given origin', () => {
    const mockStore = $rdf.graph();
    const mockApplication = $rdf.sym('https://fake.app');
    const mockOrigin = $rdf.sym('https://fake.origin');
    const mockProfile = $rdf.sym('https://fake.profile#me');
    mockStore.add(mockApplication, ns.acl('origin'), mockOrigin, mockStore);
    mockStore.add(mockApplication, ns.acl('mode'), ns.acl('Read'), mockStore);
    mockStore.add(mockProfile, ns.acl('trustedApp'), mockApplication, mockStore);
    const statementsToDelete = getStatementsToDelete(mockOrigin, mockProfile, mockStore);
    expect(statementsToDelete.length).toBe(3);
    expect(statementsToDelete).toMatchSnapshot();
  });

  it('should not return statements for a different origin', () => {
    const mockStore = $rdf.graph();
    const mockApplication = $rdf.sym('https://fake.app');
    const mockOrigin = $rdf.sym('https://fake.origin');
    const mockProfile = $rdf.sym('https://fake.profile#me');
    mockStore.add(mockApplication, ns.acl('origin'), mockOrigin, mockStore);
    mockStore.add(mockApplication, ns.acl('mode'), ns.acl('Read'), mockStore);
    mockStore.add(mockProfile, ns.acl('trustedApp'), mockApplication, mockStore);

    const statementsToDelete = getStatementsToDelete(($rdf.lit as any)('A different origin'), mockProfile, mockStore);
    expect(statementsToDelete.length).toBe(0);
    expect(statementsToDelete).toEqual([]);
  });
});

describe('getStatementsToAdd', () => {
  it('should return all required statements to add the given permissions for a given origin', () => {
    const mockOrigin = $rdf.sym('https://fake.origin');
    const mockProfile = $rdf.sym('https://fake.profile#me');
    const modes: Mode[] = ['read', 'write'];

    const statementsToAdd = getStatementsToAdd(mockOrigin, 'mock_app_id', modes, mockProfile);
    expect(statementsToAdd.length).toBe(4);
    expect(statementsToAdd).toMatchSnapshot();
  });
});

describe('deserialiseMode', () => {
  it('should convert a full namespaced ACL to a plaintext string', () => {
    expect(deserialiseMode(ns.acl('Read'))).toBe('Read');
    expect(deserialiseMode(ns.acl('Append'))).toBe('Append');
    expect(deserialiseMode(ns.acl('Write'))).toBe('Write');
    expect(deserialiseMode(ns.acl('Control'))).toBe('Control');
  });
});
