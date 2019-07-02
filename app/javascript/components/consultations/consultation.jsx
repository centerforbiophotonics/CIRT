import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bootstrap card showing all the details of a consultation and its associated models.
 */
class Consultation extends React.Component {
  static propTypes = {
    /** The model instance to display */
    consultation: PropTypes.object,
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
    let consultation = this.props.consultation;

    let buttons = (
      <a className="btn btn-secondary text-white" onClick={this.props.close}>Close</a>
    );

    return (
      <div className="card mb-3" id={"consultation_"+this.props.consultation.id}>
        <div className="card-body">
          <h3 className="card-title">Consultation</h3>
          <div className="ml-3">
            {buttons}
            <p><strong>Description: </strong>{consultation.description}</p>
              <p><strong>Dates: </strong>{consultation.dates}</p>
              <p><strong>Consultants: </strong>{consultation.consultants}</p>
              <p><strong>Minutes: </strong>{consultation.minutes}</p>
              <p><strong>Consultation Category: </strong>{consultation.consultation_category_id}</p>
              <p><strong>Ccrc: </strong>{consultation.ccrc_id}</p>
            {buttons}
          </div>
        </div>
      </div>
    )   
  }
}

export default Consultation;