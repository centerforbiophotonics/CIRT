import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bootstrap card showing all the details of a person_consultation and its associated models.
 */
class PersonConsultation extends React.Component {
  static propTypes = {
    /** The model instance to display */
    person_consultation: PropTypes.object,
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
    let person_consultation = this.props.person_consultation;

    let buttons = (
      <a className="btn btn-secondary text-white" onClick={this.props.close}>Close</a>
    );

    return (
      <div className="card mb-3" id={"person_consultation_"+this.props.person_consultation.id}>
        <div className="card-body">
          <h3 className="card-title">PersonConsultation</h3>
          <div className="ml-3">
            {buttons}
            <p><strong>Person: </strong>{person_consultation.person_id}</p>
              <p><strong>Consultation: </strong>{person_consultation.consultation_id}</p>
            {buttons}
          </div>
        </div>
      </div>
    )   
  }
}

export default PersonConsultation;