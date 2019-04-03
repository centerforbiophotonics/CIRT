import React from 'react';
import PropTypes from 'prop-types';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faTimes )

/**
 * Bootstrap card showing all the details of a person and its associated models.
 */
class PersonEventTableCell extends React.Component {
  static propTypes = {
    /** The model instance to display */
    person_events: PropTypes.object,
  }

  /** 
   * The constructor lifecycle method. 
   * @param {object} props - The component's props 
   * @public
   */
  constructor(props){
    super(props);

    this.toggleDetails = this.toggleDetails.bind(this);

    this.state = {
      show_details: false
    }
  }

  toggleDetails(){
    this.setState(prevState => ({show_details: !prevState.show_details}));
  }

 
  /** 
   * The render lifecycle method.
   * @public
   */
  render(){
    let person_events = this.props.person_events;

    let buttons = (
      <a className="btn btn-secondary text-white float-sm-right" onClick={this.props.close}>
        <FontAwesomeIcon icon="times"/>
      </a>
    );

    return (
      <div
        title={Object.values(person_events).map(pe => (pe.event.name+" ("+pe.event.date+")")).join("\n")}
      >
        {Object.keys(person_events).length}
      </div>
    )   
  }
}

export default PersonEventTableCell;