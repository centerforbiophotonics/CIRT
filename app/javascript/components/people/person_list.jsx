import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bootstrap list group showing a list of person names.
 */
class PersonList extends React.Component {
  static propTypes = {
    /** The model instances to display. */
    people: PropTypes.array,
    /** An optional handler to invoke when a model instance is clicked. */
    clickHandler: PropTypes.func
  }

  /** 
   * The render lifecycle method.
   * @public
   */
  render(){
    let people = this.props.people;

    return (
      <ul className="list-group">
        {people.map(p => 
          <li 
            key={p.id} 
            className={"list-group-item"+(this.props.clickHandler ? "-action" : "")+" p-0"}
            onClick={() => {if (this.props.clickHandler) this.props.clickHandler(p); }}>
            {p.name}
          </li>
        )} 
      </ul>
    )   
  }
}

export default PersonList;