import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bootstrap card showing all the details of a role and its associated models.
 */
class Role extends React.Component {
  static propTypes = {
    /** The model instance to display */
    role: PropTypes.object,
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
    let role = this.props.role;

    let buttons = (
      <a className="btn btn-secondary text-white" onClick={this.props.close}>Close</a>
    );

    return (
      <div className="card mb-3" id={"role_"+this.props.role.id}>
        <div className="card-body">
          <h3 className="card-title">{role.name}</h3>
          <div className="ml-3">
            {buttons}
            <p><strong>Name: </strong>{role.name}</p>
              <p><strong>Variants: </strong>{role.variants}</p>
            {buttons}
          </div>
        </div>
      </div>
    )   
  }
}

export default Role;