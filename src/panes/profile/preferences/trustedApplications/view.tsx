import * as React from 'react'
import { NamedNode } from 'rdflib'
import { TrustedApplication, Mode } from './model'

type AddOrUpdate = (origin: string, modes: Mode[]) => Promise<void>
interface Props {
  apps: Array<Exclude<TrustedApplication, { subject: NamedNode}>>;
  onSaveApp: AddOrUpdate;
  onDeleteApp: (origin: string) => Promise<void>;
}

export const View: React.FC<Props> = (props) => {
  return (
    <>
      <p>Here you can manage the applications you trust.</p>,
      <table className="results">
        <thead>
          <tr>
            <th>Application URL</th>
            <th>Access modes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {props.apps.map((app) => (
            <ApplicationRow
              key={app.origin}
              app={app}
              onSave={props.onSaveApp}
              onDelete={props.onDeleteApp}
            />
          ))}
        </tbody>
      </table>
      <NewApplication onSave={props.onSaveApp}/>
      <h4>Notes</h4>
      <ol>
        <li>Trusted applications will get access to all resources that you have access to.</li>
        <li>You can limit which modes they have by default.</li>
        <li>They will not gain more access than you have.</li>
      </ol>
      <p>
        Application URLs must be valid URL.
        Examples are http://localhost:3000, https://trusted.app, and https://sub.trusted.app.
      </p>
    </>
  )
}

const ApplicationRow: React.FC<{
  app: TrustedApplication,
  onSave: AddOrUpdate,
  onDelete: (origin: string) => Promise<void>
}> = (props) => {
  const initialModes = {
    Read: props.app.modes.indexOf('Read') !== -1,
    Append: props.app.modes.indexOf('Append') !== -1,
    Write: props.app.modes.indexOf('Write') !== -1,
    Control: props.app.modes.indexOf('Control') !== -1
  }
  const [modes, setModes] = React.useState<{[ key: string]: boolean}>(initialModes)

  const setMode = (mode: Mode, checked: boolean) => {
    setModes({ ...modes, [mode]: checked })
  }
  const getCheckboxHandler = (mode: Mode) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => setMode(mode, event.target.checked)
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault()

    const newModes = Object.keys(modes).filter(mode => modes[mode]) as Mode[]
    props.onSave(props.app.origin, newModes)
  }

  return (
    <tr>
      <td>
        <p>{props.app.origin}</p>
      </td>
      <td>
        <form onSubmit={submitHandler}>
          <div className="input-wrap">
            <label className="checkbox">
              <input
                type="checkbox"
                onChange={getCheckboxHandler('Read')}
                checked={modes.Read}
                name="Read"
                id="Read"
              />
              Read
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                onChange={getCheckboxHandler('Append')}
                checked={modes.Append}
                name="Append"
                id="Append"
              />
              Append
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                onChange={getCheckboxHandler('Write')}
                checked={modes.Write}
                name="Write"
                id="Write"
              />
              Write
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                onChange={getCheckboxHandler('Control')}
                checked={modes.Control}
                name="Control"
                id="Control"
              />
              Control
            </label>
          </div>
          <button type="submit">Save</button>
        </form>
      </td>
      <td>
        <button onClick={() => props.onDelete(props.app.origin)}>Delete</button>
      </td>
    </tr>
  )
}

const NewApplication: React.FC<{ onSave: AddOrUpdate }> = (props) => {
  const [origin, setOrigin] = React.useState()
  const [modes, setModes] = React.useState<{[ key: string]: boolean}>({
    Read: false,
    Append: false,
    Write: false,
    Control: false
  })

  const setMode = (mode: Mode, checked: boolean) => {
    setModes({ ...modes, [mode]: checked })
  }
  const getCheckboxHandler = (mode: Mode) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => setMode(mode, event.target.checked)
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault()

    const newModes = Object.keys(modes).filter(mode => modes[mode]) as Mode[]
    props.onSave(origin, newModes)
  }

  return (
    <form onSubmit={submitHandler}>
      <div className="input-wrap">
        <label>App URL:</label>
        <input
          type="url"
          onChange={(e) => setOrigin(e.target.value)}
          name="origin"
          id="origin"
          placeholder="https://example.com"
        />
      </div>
      <div className="input-wrap">
        <label className="checkbox">
          <input
            type="checkbox"
            onChange={getCheckboxHandler('Read')}
            name="Read"
            id="Read"
          />
          Read
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            onChange={getCheckboxHandler('Append')}
            name="Append"
            id="Append"
          />
          Append
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            onChange={getCheckboxHandler('Write')}
            name="Write"
            id="Write"
          />
          Write
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            onChange={getCheckboxHandler('Control')}
            name="Control"
            id="Control"
          />
          Control
        </label>
      </div>
      <button type="submit">Add</button>
    </form>
  )
}