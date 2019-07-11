import React from 'react';
import { PaneContainer } from '../../components/PaneLoader';
import { Turtle } from './Turtle';
import { Resources } from './Resources';
import { Toggle } from '../../components/styleguide/Toggle';

export const Container: PaneContainer = (props) => {
  const [tableView, setTableView] = React.useState(true);

  const toggleView = () => {
    setTableView(!tableView);
  }

  return (
    <section className="section">
      <p className="content">Unfortunately we do not yet have a Pane to display this type of resource.</p>
      <p className="content">You can see the raw document below:</p>
      {tableView
        ? <Resources resource={props.resource} store={props.store}/>
        : <Turtle resource={props.resource} store={props.store}/>
      }
      <Toggle onChange={toggleView} label="Table view" defaultChecked={tableView}/>
    </section>
  );
};
