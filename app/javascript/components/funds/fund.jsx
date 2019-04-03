import React from 'react';
import PropTypes from 'prop-types';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faTimes )


/**
 * Bootstrap card showing all the details of a fund and its associated models.
 */
class Fund extends React.Component {
  static propTypes = {
    /** The model instance to display */
    fund: PropTypes.object,
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
    let fund = this.props.fund;

    let buttons = (
      <a className="btn btn-secondary text-white" onClick={this.props.close}>
        <FontAwesomeIcon icon="times"/>
      </a>
    );

    return (
      <div className="card mb-3" id={"fund_"+this.props.fund.id}>
        <div className="card-body">
          <h3 className="card-title">{fund.name}</h3>
          <div className="ml-3">
            {buttons}
            <p><strong>Person: </strong>{fund.person.name} ({fund.person.id})</p>
              <p><strong>Amount: </strong>{fund.amount}</p>
              <p><strong>Name: </strong>{fund.name}</p>
              <p><strong>Description: </strong>{fund.description}</p>
              <p><strong>Date: </strong>{fund.date}</p>
              <p><strong>External: </strong>{fund.external}</p>
              <p><strong>Source: </strong>{fund.source}</p>
            {buttons}
          </div>
        </div>
      </div>
    )   
  }
}

export default Fund;