import React from 'react';
import ReactDOM from 'react-dom';
// Test Renderer for Jest
import TestRenderer from 'react-test-renderer';
// Dependencies for Enzyme
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App, { Button, Loading, Search, Table } from './App';

Enzyme.configure({ adapter: new Adapter( )});

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  // Jest test snapshot
  test('has a valid snapshot', () => {
    const component = TestRenderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Loading', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Loading/>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = TestRenderer.create(<Loading />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Search', () => {
  const props = {
    onChange: () => true,
    onSubmit: () => true,
  }
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search {...props}>Search</Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = TestRenderer.create(<Search {...props}>Search</Search>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Button', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button onClick={() => true}>Click Me</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = TestRenderer.create(<Button onClick={() => true}>Click Me</Button>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Enzyme unit test
  it('renders children properly', () => {
    const element = mount( <Button onClick={() => true}>Click Me</Button> );
    expect(element.children().text()).toBe('Click Me');
  });

  it('renders class properly', () => {
    const element = mount( <Button onClick={() => true} className='bert'>Click Me</Button> );
    expect(element.hasClass('bert'));
  });
});

describe('Table', () => {
  const props = {
    list: [
      {
        url: '1',
        title: '1',
        author: '1',
        num_comments: 1,
        points: 2,
        objectID: 'y'
      },
      {
        url: '2',
        title: '2',
        author: '2',
        num_comments: 1,
        points: 2,
        objectID: 'z'
      },
    ],
    sortKey: 'TITLE',
    isSortReverse: false,
    onDismiss: () => true
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table {...props} />, div)
  });

  test('has a valid snapshot', () => {
    const component = TestRenderer.create(<Table {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Enzyme shallow unit test (does not render child components)
  it('shows 2 items in list', () => {
    const element = shallow(<Table {...props}/>);
    expect(element.find('.table-row').length).toBe(2);
  });
});