import React from 'react';
import PropTypes from 'prop-types';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faTimes )

import PersonGroups from '../person_groups/person_groups';


/**
 * Bootstrap card showing all the details of a group and its associated models.
 */
class Group extends React.Component {
  static propTypes = {
    /** The model instance to display */
    group: PropTypes.object,
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
    let group = this.props.group;

    let buttons = (
      <a className="btn btn-secondary text-white" onClick={this.props.close}>
        <FontAwesomeIcon icon="times"/>
      </a>
    );

    return (
      <div className="card mb-3" id={"group_"+this.props.group.id}>
        <div className="card-body">
          <h3 className="card-title">{group.name}</h3>
          <div className="ml-3">
            {buttons}
            {console.log(group)}
            <p><strong>Name: </strong>{group.name}</p>
              <p><strong>Description: </strong>{group.description}</p>
              <p>
                <strong>Group Category: </strong>
                {group.group_category == undefined ? "None" : group.group_category.name}
              </p>
              <PersonGroups
                person_groups={group.person_groups}
                parent_model="Group"
                parent={group}
                defaultPageSize={5}
                readOnly={true}
              />
            {buttons}
          </div>
        </div>
      </div>
    )
  }
}

export default Group;
