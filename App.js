import React, { Component } from 'react';
import { Provider } from 'react-redux';
import RootNavigator from  './client/index';
import store from './client/store';

export default class App extends Component {
  render(){
    return (
      <Provider store={store}>
        <RootNavigator/>
      </Provider>
    )
  }
}