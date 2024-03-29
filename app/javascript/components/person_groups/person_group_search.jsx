import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

/**
 * A search box which calls a server action to display a list of results 
 * and allows the user to select one which is passed back to a parent component via a prop function. 
 * Can be used to search for and select an associated record for a belongs_to or has_one association.
 */
class PersonGroupSearch extends React.Component {
  static propTypes = {
    /** @type {function} A handler which is passed the search result selected by the user. */
    handleResultSelected: PropTypes.func
  }

  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);

    this.searchTimeout = null;
    
    this.state = {
      search_text: "",
      results:[]
    };

    this.token = document.head.querySelector("[name=csrf-token]").content;
    this.headers = {
      'Content-Type' : 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': this.token
    };
  }

  handleChange(e, {newValue}){
    this.setState({
      search_text: newValue
    });    
  }

  onSuggestionsFetchRequested(){
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {  

      fetch('/person_groups/search',{
        method: 'POST',
        body: JSON.stringify({
          search_text: this.state.search_text
        }),
        headers: this.headers,
        credentials: 'same-origin'
      }).then(res => res.json())
        .then((data) => {
            this.setState({
              results: data
            });
          },
          (error) => {
            this.setState({
              error:error 
            });
          }
        )
    }, 500); 
  }

  onSuggestionsClearRequested(){
    this.setState({
      search_text: "",
      results: []
    });
  }

  renderSuggestion(suggestion){
    return (
      <div>
        {suggestion.name}
      </div>
    );
  }

  render(){
    const inputProps = {
      placeholder: 'Enter a Person Group name',
      value: this.state.search_text,
      onChange: this.handleChange
    };

    return (
      <div className="person_group-search">
        <p className="small-indent">Search for an existing Person Group</p>
        <Autosuggest
          suggestions={this.state.results}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={suggestion => suggestion.name}
          onSuggestionSelected={(e, d) => {this.props.handleResultSelected(d.suggestion)}}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

export default PersonGroupSearch;
