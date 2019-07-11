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
      <h2 className="title">Applications</h2>
      <p className="content">Manage which applications can access data on your Pod.</p>
      <p className="content">Note: applications will never have more access than you have.</p>
      <table className="table is-fullwidth is-bordered is-striped">
        <thead>
          <tr>
            <th>Application URL</th>
            <th>Access level</th>
            <th></th>
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
          <div className="field is-grouped">
            <div className="control">
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
            </div>
            <div className="control">
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
            </div>
            <div className="control">
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
            </div>
            <div className="control">
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
          </div>
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-small">Save</button>
            </div>
          </div>
        </form>
      </td>
      <td className="has-text-right is-narrow">
        <button
          onClick={() => props.onDelete(props.app.origin)}
          className="button is-danger is-small"
        >Delete</button>
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
    <form onSubmit={submitHandler} className="footer">
      <div className="field">
        <label className="label">App URL:</label>
        <input
          type="url"
          onChange={(e) => setOrigin(e.target.value)}
          name="origin"
          id="origin"
          placeholder="https://example.com"
          className="input"
        />
      </div>
      <div className="field">
        <div className="control">
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
      </div>
      <div className="field">
        <div className="control">
          <button type="submit" className="button is-primary">Give access</button>
        </div>
      </div>
    </form>
  )
}