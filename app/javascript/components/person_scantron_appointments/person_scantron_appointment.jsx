import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bootstrap card showing all the details of a person_scantron_appointment and its associated models.
 */
class PersonScantronAppointment extends React.Component {
  static propTypes = {
    /** The model instance to display */
    person_scantron_appointment: PropTypes.object,
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
    let person_scantron_appointment = this.props.person_scantron_appointment;

    let buttons = (
      <a className="btn btn-secondary text-white" onClick={this.props.close}>Close</a>
    );

    return (
      <div className="card mb-3" id={"person_scantron_appointment_"+this.props.person_scantron_appointment.id}>
        <div className="card-body">
          <h3 className="card-title">PersonScantronAppointment</h3>
          <div className="ml-3">
            {buttons}
            <p><strong>Person: </strong>{person_scantron_appointment.person_id}</p>
              <p><strong>Scantron Appointment: </strong>{person_scantron_appointment.scantron_appointment_id}</p>
            {buttons}
          </div>
        </div>
      </div>
    )   
  }
}

export default PersonScantronAppointment;