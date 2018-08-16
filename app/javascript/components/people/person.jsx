import React from 'react';
import PropTypes from 'prop-types';

import PersonForm from './person_form';

/**
 * Bootstrap card showing all the details of a person and its associated models.
 */
class Person extends React.Component {
  static propTypes = {
    /** The model instance to display */
    person: PropTypes.object,
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
    let person = this.props.person;

    let buttons = (
      <a className="btn btn-secondary text-white" onClick={this.props.close}>Close</a>
    );

    return (
      <div className="card mb-3" id={"person_"+this.props.person.id}>
        <div className="card-body">
          <h3 className="card-title">{person.name}</h3>
          <div className="ml-3">
            {buttons}
            <p><strong>Name: </strong>{person.name}</p>
              <p><strong>Email: </strong>{person.email}</p>
              <p><strong>Pidm: </strong>{person.pidm}</p>
              <p><strong>Sid: </strong>{person.sid}</p>
              <p><strong>Emp: </strong>{person.emp_id}</p>
              <p><strong>Iam: </strong>{person.iam_id}</p>
              <p><strong>Cas User: </strong>{person.cas_user}</p>
              <p><strong>Dems: </strong>{person.dems_id}</p>
              <p><strong>Cims: </strong>{person.cims_id}</p>
            {buttons}
          </div>
        </div>
      </div>
    )   
  }
}

export default Person;