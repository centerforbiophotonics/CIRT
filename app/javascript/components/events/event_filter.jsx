import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import AriaModal from 'react-aria-modal';

import Select from 'react-select';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import EventSearch from './event_search';

/**
 * Component which toggles a modal for filtering people based on their event attendance.
 */
class EventFilter extends React.Component {
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
      event_categories:[],
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
      status: ["Attended", "Registered"],
      comparator: ">=",
      number: 0,
      date_start: null,
      date_end: null,
      category: "Any",
      list: [] 
    }
  }

  clearFilter(){
    this.setState({condition:this.defaultConditions(), dirty: false});
  }

  fetchPeopleFromConditions(){
    var url = new URL(window.location.origin+"/people/event_filter.json");
    for (let condition in this.state.condition){
      if (
        this.state.condition[condition] !== null &&
        this.state.condition[condition] !== "Any"
      ){
        if (this.state.condition[condition]._isAMomentObject ){
          url.searchParams.append(condition, this.state.condition[condition].format("YYYY-MM-DD"));
        } else {
          url.searchParams.append(condition, this.state.condition[condition]);
        }
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
            titleText="Event Filter"
            titleId="event-filter-title"
            onExit={this.toggleOpen}
            initialFocus="#event-filter-modal"
            getApplicationNode={this.getApplicationNode}
            underlayClickExits={false}
          >
            <div className="card mt-3 p-3" id="event-filter-modal">
              <h2 className="card-title text-center" id="event-filter-title">
                {this.props.title}     
              </h2>

              <div className="form-inline">

                <Select
                  className="mr-2"
                  id="status"
                  value={
                    this.state.condition.status.map(s => (
                      {value: s, label: s})
                    )
                  }
                  onChange={(e)=> { this.updateCondition("status", e.map(v => (v.value))) }}
                  isMulti={true}
                  options={[ 
                    {value:"Attended", label:"Attended"}, 
                    {value:"Registered", label:"Registered"}
                  ]}

                  styles={{
                    indicatorsContainer: base => ({
                      ...base,
                      display: 'none'
                    }),
                    container: base => ({
                      ...base,
                      width: '230px'
                    })
                  }}
                />

                <Select
                  className="mr-2"
                  id="comparator"
                  value={{value: this.state.condition.comparator, label: this.state.condition.comparator}}
                  onChange={(e)=> { this.updateCondition("comparator", e.value) }}
                  options={[
                    {value:">=", label:">="}, 
                    {value:"=", label:"="}, 
                    {value:"<=", label:"<="}, 
                    {value:">", label:">"}, 
                    {value:">", label:">"}
                  ]}
                  styles={{
                    indicatorsContainer: base => ({
                      ...base,
                      display: 'none'
                    }),
                    container: base => ({
                      ...base,
                      width: '40px'
                    })
                  }}
                />

                <input
                  className="mr-2 form-control"
                  id="number"                    
                  type="numeric"
                  value={this.state.condition.number}
                  onChange={(e)=> { this.updateCondition("number", e.target.value) }}
                  style={{width: "60px", display:"inline-block"}}
                /> 

                <label htmlFor="number">Events</label>
              </div>

              <div className="form-inline ml-3 mt-3">
                <label className="mr-2" htmlFor="date_start">On or After</label>
                <DatePicker
                  className="mr-2 form-control"
                  id="date_start"
                  dateFormat="YYYY-MM-DD"
                  selected={this.state.condition.date_start}
                  onChange={(e)=> { this.updateCondition("date_start", e) }}
                  maxDate={moment().add(1, "days")}
                  minDate={moment("20160101", "YYYYMMDD")}
                  showYearDropdown
                  popperPlacement={"auto"}
                />
              </div>

              <div className="form-inline ml-3 mt-3">
                <label className="mr-2" htmlFor="date_end">On or Before</label>
                <DatePicker
                  className="mr-2 form-control"
                  id="date_end"
                  dateFormat="YYYY-MM-DD"
                  selected={this.state.condition.date_end}
                  onChange={(e)=> { this.updateCondition("date_end", e) }}
                  maxDate={moment().add(1, "days")}
                  minDate={moment("20160101", "YYYYMMDD")}
                  showYearDropdown
                  popperPlacement={"auto"}
                />
              </div>

              <div className="form-inline ml-3 mt-3">
                <label className="mr-2" htmlFor="category">In Category</label>
                <Select
                  id="category"
                  value={{value: this.state.condition.category, label: this.state.condition.category}}
                  onChange={(e)=> { this.updateCondition("category", e.value) }}
                  options={this.state.event_categories.map(ec => {
                    return {label: ec.name, value: ec.name};
                  })}
                  styles={{
                    indicatorsContainer: base => ({
                      ...base,
                      display: 'none'
                    }),
                    container: base => ({
                      ...base,
                      width: '200px'
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
    fetch("/event_categories.json")
      .then(res => res.json())
      .then(
        (res) => { 
          this.setState({event_categories: [{name: "Any"}].concat(Object.values(res))});
        },
        (error) => {
          this.setState({
            error:error 
          });
        }
      )
  }
}

export default EventFilter;