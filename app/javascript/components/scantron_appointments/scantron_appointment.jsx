import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bootstrap card showing all the details of a scantron_appointment and its associated models.
 */
class ScantronAppointment extends React.Component {
  static propTypes = {
    /** The model instance to display */
    scantron_appointment: PropTypes.object,
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
    let scantron_appointment = this.props.scantron_appointment;

    let buttons = (
      <a className="btn btn-secondary text-white" onClick={this.props.close}>Close</a>
    );

    return (
      <div className="card mb-3" id={"scantron_appointment_"+this.props.scantron_appointment.id}>
        <div className="card-body">
          <h3 className="card-title">ScantronAppointment</h3>
          <div className="ml-3">
            {buttons}
            <p><strong>Date: </strong>{scantron_appointment.date}</p>
              <p><strong>Course: </strong>{scantron_appointment.course}</p>
              <p><strong>Term Code: </strong>{scantron_appointment.term_code}</p>
              <p><strong>Number Of Scantrons: </strong>{scantron_appointment.number_of_scantrons}</p>
            {buttons}
          </div>
        </div>
      </div>
    )   
  }
}

export default ScantronAppointment;