import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bootstrap list group showing a list of person names.
 */
class EventList extends React.Component {
  static propTypes = {
    /** The model instances to display. */
    events: PropTypes.array,
    /** An optional handler to invoke when a model instance is clicked. */
    clickHandler: PropTypes.func
  }

  /** 
   * The render lifecycle method.
   * @public
   */
  render(){
    let events = this.props.events;

    return (
      <ul className="list-group">
        {events.map(e => 
          <li 
            key={e.id} 
            className={"list-group-item"+(this.props.clickHandler ? "-action" : "")+" p-0"}
            onClick={() => {if (this.props.clickHandler) this.props.clickHandler(e); }}
          >
            {e.name} ({e.date})
          </li>
        )} 
      </ul>
    )   
  }
}

export default EventList;