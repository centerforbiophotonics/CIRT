import React from 'react';
import PropTypes from 'prop-types';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faTimes )

/**
 * Bootstrap card showing all the details of a event and its associated models.
 */
class Event extends React.Component {
  static propTypes = {
    /** The model instance to display */
    event: PropTypes.object,
    /** @type {object} The attributes of the user who requested the page. */
    current_user: PropTypes.object,
    /** @type {function} A handler to invoke to close/hide the show card. */
    close: PropTypes.func,
  }

  /** 
   * The constructor lifecycle method. 
   * @param {object} props - The component's props 
   * @public
   */
  constructor(props){
    super(props);
  }

  /** 
   * The render lifecycle method.
   * @public
   */
  render(){
    let event = this.props.event;

    let buttons = (
      <a className="btn btn-secondary text-white float-sm-right" onClick={this.props.close}>
        <FontAwesomeIcon icon="times"/>
      </a>
    );

    return (
      <div className="card mb-3" id={"event_"+this.props.event.id}>
        <div className="card-body">
          {buttons}
          <h3 className="card-title">{event.name}</h3>
          <div className="ml-3">  
            <p><strong>Name: </strong>{event.name}</p>
            <p><strong>Description: </strong>{event.description}</p>
            <p><strong>Date: </strong>{event.date}</p>
            <p><strong>Event Category: </strong>{event.event_category_id}</p>
            <p><strong>Tag List: </strong>{event.tags}</p>
          </div>
        </div>
      </div>
    )   
  }
}

export default Event;