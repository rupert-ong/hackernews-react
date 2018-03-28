import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

// Higher Order function defined outside of component
const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
      error: null,
    }
  }

  onSearchChange = e => {
    this.setState({ searchTerm: e.target.value });
  }

  onDismiss = (id) => {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ 
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  setSearchTopStories(result) {
    this.setState({ error: null, result });
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => {
        if(response.ok) return response.json();
        throw new Error('Something went wrong...');
      })
      .then(result => this.setSearchTopStories(result))
      .catch(error => this.setState({ error }));
  }

  render() {
    const { result, searchTerm, error } = this.state;

    if(!result) return null;

    if(error) {
      return <p>{error.message}</p>;
    }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search
          </Search>
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, children }) =>
  <form>
    {children && <label>{children}</label>}
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
  </form>

const Table = ({ list, onDismiss, pattern }) =>
  <div className="table">
    {list.filter(isSearched(pattern)).map(item =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}><a href={item.url}>{item.title}</a></span>
        <span style={{ width: '30%' }}>{item.author}</span>
        <span style={{ width: '10%' }}>{item.num_comments}</span>
        <span style={{ width: '10%' }}>{item.points}</span>
        <span style={{ width: '10%' }}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>

const Button = ({ children, className = '', onClick }) => 
  <button
    className={className}
    onClick={onClick}
    type="button"
  >
    {children}
  </button>

export default App;