import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import AriaModal from 'react-aria-modal';

import Select from 'react-select';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import GroupSearch from './group_search';

/**
 * Component which toggles a modal for filtering people based on their group affiliations.
 */
class GroupFilter extends React.Component {
  static propTypes = {
    title: PropTypes.string
  }

  /** 
   * The constructor lifecycle method. 
   * @param {object} props - The component's props 
   * @public
   */
  constructor(props){
    super(props);

    this.toggleOpen = this.toggleOpen.bind(this);
    this.getApplicationNode = this.getApplicationNode.bind(this);
    this.updateCondition = this.updateCondition.bind(this);
    this.defaultConditions = this.defaultConditions.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.fetchPeopleFromConditions = this.fetchPeopleFromConditions.bind(this);

    this.state = {
      condition: this.defaultConditions(),
      groups:[],
      roles:[],
      open: false,
      dirty: false
    }

    this.token = document.head.querySelector("[name=csrf-token]").content;
    this.headers = {
      'Content-Type' : 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': this.token
    };
  }

  toggleOpen(){
    this.setState(prevState => ({open: !prevState.open}));
  }

  getApplicationNode(){
    return document.getElementById('root');
  }

  updateCondition(condition, value){
    this.setState(prevState => {
      prevState.dirty = true;
      prevState.condition[condition] = value;
      return prevState;
    });
  }

  defaultConditions(){
    return {
      roles: [],
      groups: [] 
    }
  }

  clearFilter(){
    this.setState({condition:this.defaultConditions(), dirty: false});
  }

  fetchPeopleFromConditions(){
    var url = new URL(window.location.origin+"/people/group_filter.json");
    for (let condition in this.state.condition){
      if (condition === "groups"){
        url.searchParams.append(condition, this.state.condition[condition].map(g => (g.value)));
      } else {
        url.searchParams.append(condition, this.state.condition[condition]);
      }
    }

    fetch(url)
      .then(res => res.json())
      .then(
        (res) => {
          this.props.apply(res);
          this.toggleOpen();
        },
        (error) => {
          this.setState({
            error:error 
          });
        }
      )
  }

  /** 
   * The render lifecycle method.
   * @public
   */
  render(){
    return (
      <div>
        <button 
          className={"btn "+(this.state.dirty ? "btn-warning" : "btn-secondary")+" text-white btn-sm"} 
          onClick={this.toggleOpen}
        >
          Filter
        </button>
        {this.state.open && 
          <AriaModal
            titleText="Group Filter"
            titleId="group-filter-title"
            onExit={this.toggleOpen}
            initialFocus="#group-filter-modal"
            getApplicationNode={this.getApplicationNode}
            underlayClickExits={false}
          >
            <div className="card mt-3 p-3" id="group-filter-modal">
              <h2 className="card-title text-center" id="group-filter-title">
                {this.props.title}     
              </h2>

              <div className="form-group mb-3">
                <label htmlFor="roles">Have any of the following roles</label>
                <Select
                  className="ml-2"
                  id="roles"
                  placeholder="Any"
                  value={
                    this.state.condition.roles.map(s => (
                      {value: s, label: s})
                    )
                  }
                  onChange={(e)=> { this.updateCondition("roles", e.map(v => (v.value))) }}
                  isMulti={true}
                  options={this.state.roles.map(r => ({label: r, value: r}))}
                  styles={{
                    indicatorsContainer: base => ({
                      ...base,
                      display: 'none'
                    }),
                    container: base => ({
                      ...base,
                      width: '520px'
                    })
                  }}
                />
              </div> 

              <div className="form-group">
                <label htmlFor="groups">Or belong to any of the following groups</label>
                <Select
                  className="ml-2"
                  id="groups"
                  placeholder="Any"
                  value={this.state.condition.groups}
                  onChange={(e)=> { this.updateCondition("groups", e) }}
                  isMulti={true}
                  options={this.state.groups.map(g => ({label: g.name, value:g.id}))}
                  styles={{
                    indicatorsContainer: base => ({
                      ...base,
                      display: 'none'
                    }),
                    container: base => ({
                      ...base,
                      width: '520px'
                    })
                  }}
                />
              </div> 

              <div className="form-actions mt-3">
                <button 
                  type="button" 
                  className="btn btn-primary text-white" 
                  onClick={this.fetchPeopleFromConditions}
                >
                  Apply
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-primary text-white float-right" 
                  onClick={this.clearFilter}
                >
                  Clear
                </button>         
              </div> 
            </div>
          </AriaModal>
        }
        
      </div>
    )   
  }

  componentDidMount(){
    fetch("/groups.json")
      .then(res => res.json())
      .then(
        (res) => { 
          this.setState({groups: Object.values(res)});
        },
        (error) => {
          this.setState({
            error:error 
          });
        }
      );

    fetch("/person_groups/all_roles.json")
      .then(res => res.json())
      .then(
        (res) => { 
          this.setState({roles: Object.values(res)});
        },
        (error) => {
          this.setState({
            error:error 
          });
        }
      );
  }
}

export default GroupFilter;