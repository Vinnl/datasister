import React from 'react';
import { PaneContainer } from '../../components/PaneLoader';
import { Turtle } from './Turtle';
import { Resources } from './Resources';
import { Toggle } from '../../components/styleguide/Toggle';

export const Container: PaneContainer = (props) => {
  const [cardView, setCardView] = React.useState(true);

  const toggleView = () => {
    setCardView(!cardView);
  }

  return (
    <section>
      <p>Unfortunately we do not yet have a Pane to display this type of resource.</p>
      <p>You can see the raw document below:</p>
      <Toggle onChange={toggleView} label="Card view" defaultChecked={cardView}/>
      {cardView
        ? <Resources resource={props.resource} store={props.store}/>
        : <Turtle resource={props.resource} store={props.store}/>
      }
    </section>
  );
};
