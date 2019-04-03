import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bootstrap card showing all the details of a person_group and its associated models.
 */
class PersonGroup extends React.Component {
  static propTypes = {
    /** The model instance to display */
    person_group: PropTypes.object,
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
    let person_group = this.props.person_group;

    let buttons = (
      <a className="btn btn-secondary text-white" onClick={this.props.close}>Close</a>
    );

    return (
      <div className="card mb-3" id={"person_group_"+this.props.person_group.id}>
        <div className="card-body">
          <h3 className="card-title">PersonGroup</h3>
          <div className="ml-3">
            {buttons}
            <p><strong>Group: </strong>{person_group.group_id}</p>
              <p><strong>Person: </strong>{person_group.person_id}</p>
              <p><strong>Role: </strong>{person_group.role}</p>
              <p><strong>Start: </strong>{person_group.start}</p>
              <p><strong>End: </strong>{person_group.end}</p>
            {buttons}
          </div>
        </div>
      </div>
    )   
  }
}

export default PersonGroup;