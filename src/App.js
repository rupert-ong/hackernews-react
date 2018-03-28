import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'http://facebook.github.io/react',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectId: 0
  },
  {
    title: 'Redux',
    url: 'http://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectId: 1
  }
];

// Higher Order function defined outside of component
const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: ''
    }
  }

  onSearchChange = e => {
    this.setState({ searchTerm: e.target.value });
  }

  onDismiss = (id) => {
    const updatedList = this.state.list.filter(item => item.objectId !== id);
    this.setState({ list: updatedList });
  }

  render() {
    const { list, searchTerm } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
        >
          Search
        </Search>
        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

const Search = ({ searchTerm, onChange, children }) =>
  <form>
    {children && <label>{children}</label>}
    <input
      type="text"
      value={searchTerm}
      onChange={onChange}
    />
  </form>

const Table = ({ list, onDismiss, pattern }) =>
  <div>
    {list.filter(isSearched(pattern)).map(item =>
      <div key={item.objectId}>
        <span><a href={item.url}>{item.title}</a></span>{' '}
        <span>{item.author}</span>{' '}
        <span>{item.num_comments}</span>{' '}
        <span>{item.points}</span>{' '}
        <span>
          <Button
            onClick={() => onDismiss(item.objectId)}
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