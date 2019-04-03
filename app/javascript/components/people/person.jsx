import React from 'react';
import PropTypes from 'prop-types';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faTimes )


import EventList from '../events/event_list';
import Event from '../events/event';

import PersonGroups from '../person_groups/person_groups';
import PersonFunds from '../person_funds/person_funds';
import PersonEvents from '../person_events/person_events';

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

    this.toggleIds = this.toggleIds.bind(this);
    this.handleEventSelected = this.handleEventSelected.bind(this);
    this.handleEventDeselect = this.handleEventDeselect.bind(this);

    this.state = {
      showing_event: null,
      showing_ids: false
    }
  }

  toggleIds(){
    this.setState(prevState => ({showing_ids: !prevState.showing_ids}));
  }

  handleEventSelected(event){
    console.log(event);
    this.setState({showing_event: event});
  }

  handleEventDeselect(){
    this.setState({showing_event: null});
  }

  /** 
   * The render lifecycle method.
   * @public
   */
  render(){
    let person = this.props.person;

    let buttons = (
      <a className="btn btn-secondary text-white float-sm-right" onClick={this.props.close}>
        <FontAwesomeIcon icon="times"/>
      </a>
    );

    return (
      <div className="card mb-3" id={"person_"+person.id}>
        <div className="card-body">
          {buttons}
          
          <h3 className="card-title">{person.name}</h3>
          <div className="ml-3">
            <div className="row">
              <div className="col-md-4">
                <p><strong>Name: </strong>{person.name}</p>
                <p><strong>Email: </strong>{person.email}</p>
                <a 
                  className="btn btn-secondary text-white" 
                  target="_blank" 
                  href={
                    "http://directory.ucdavis.edu/search/directory_results.shtml?filter="+
                    encodeURIComponent(person.name)
                  }
                >
                  UCD Directory
                </a>
              </div>
              <div className="col-md-8">
                <a className="btn btn-secondary text-white" onClick={this.toggleIds}>IDs</a>
                {this.state.showing_ids &&
                  <div className="row">
                    <div className="col-md-3">
                      <p><strong>PIDM: </strong>{person.pidm}</p>
                      <p><strong>SID: </strong>{person.sid}</p>
                    </div>
                    <div className="col-md-3">
                      <p><strong>Emp: </strong>{person.emp_id}</p>
                      <p><strong>IAM: </strong>{person.iam_id}</p>
                    </div>
                    <div className="col-md-3">
                      <p><strong>Cas User: </strong>{person.cas_user}</p>
                      <p><strong>DEMS: </strong>{person.dems_id}</p>
                    </div>
                    <div className="col-md-3">
                      <p><strong>CIMS: </strong>{person.cims_id}</p>
                      <p><strong>LMS: </strong>{person.lms_id}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
            
            <div className="mt-3">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" id="groups-tab" data-toggle="tab" href="#groups" role="tab" aria-controls="groups" aria-selected="true">
                    Groups ({Object.keys(person.person_groups).length})
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" id="funds-tab" data-toggle="tab" href="#funds" role="tab" aria-controls="funds" aria-selected="false">
                    Funds ({Object.keys(person.person_funds).length})
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" id="funds-tab" data-toggle="tab" href="#events" role="tab" aria-controls="events" aria-selected="false">
                    Events ({Object.keys(person.person_events).length})
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="groups" role="tabpanel" aria-labelledby="groups-tab">
                  <PersonGroups
                    person_groups={person.person_groups}
                    parent_model="Person"
                    parent={person}
                    defaultPageSize={5}
                    readOnly={true}
                  />
                </div>
                <div className="tab-pane fade" id="funds" role="tabpanel" aria-labelledby="funds-tab">
                  <PersonFunds
                    person_funds={person.person_funds}
                    parent_model="Person"
                    parent={person}
                    defaultPageSize={5}
                    readOnly={true}
                  />
                </div>
                <div className="tab-pane fade" id="events" role="tabpanel" aria-labelledby="funds-tab">
                  <PersonEvents
                    person_events={person.person_events}
                    parent_model="Person"
                    parent={person}
                    defaultPageSize={5}
                    readOnly={true}
                  />
                </div>
              </div>  
            </div>
          </div>


        </div>
      </div>
    )   
  }
}

export default Person;