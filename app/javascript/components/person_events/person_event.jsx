import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bootstrap card showing all the details of a person_event and its associated models.
 */
class PersonEvent extends React.Component {
  static propTypes = {
    /** The model instance to display */
    person_event: PropTypes.object,
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
    let person_event = this.props.person_event;

    let buttons = (
      <a className="btn btn-secondary text-white" onClick={this.props.close}>Close</a>
    );

    return (
      <div className="card mb-3" id={"person_event_"+this.props.person_event.id}>
        <div className="card-body">
          <h3 className="card-title">PersonEvent</h3>
          <div className="ml-3">
            {buttons}
            <p><strong>Person: </strong>{person_event.person.name}</p>
              <p><strong>Event: </strong>{person_event.event.name}</p>
              <p><strong>Status: </strong>{person_event.status}</p>
            {buttons}
          </div>
        </div>
      </div>
    )   
  }
}

export default PersonEvent;