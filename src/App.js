import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false
    }
  }

  onSearchChange = e => {
    this.setState({ searchTerm: e.target.value });
  }

  onSearchSubmit = e => {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    e.preventDefault();
  }

  onDismiss = (id) => {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ 
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const oldHits = page !== 0
      ? this.state.result.hits
      : [];
    const updatedHits = [
      ...oldHits,
      ...hits
    ]
    this.setState({ 
      error: null, 
      result: {hits: updatedHits, page },
      isLoading: false
    });
  }

  fetchSearchTopStories(searchTerm, page=0) {
    this.setState({ isLoading: true });
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => {
      if(response.ok) return response.json();
      throw new Error('Something went wrong...');
    })
    .then(result => this.setSearchTopStories(result))
    .catch(error => this.setState({ isLoading: false, error }));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    const { result, searchTerm, error, isLoading } = this.state;
    const page = (result && result.page) || 0;

    if(error) {
      return <p>{error.message}</p>;
    }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
          { (result && result.hits.length)
            ? <Table
                list={result.hits}
                onDismiss={this.onDismiss}
              />
            : <p style={{ textAlign: 'center' }}>No results found</p>
          }
        <div className="interactions">
          <Button 
              onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
              disabled={isLoading}
            >
              More
          </Button>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">{children}</button>
  </form>

const Table = ({ list, onDismiss, pattern }) =>
  <div className="table">
    {list.map(item =>
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

const Button = ({ children, className = '', disabled = false, onClick }) => 
  <button
    className={className}
    onClick={onClick}
    type="button"
    disabled={disabled}
  >
    {children}
  </button>

export default App;