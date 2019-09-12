import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './screen/Login';
import Reader from './screen/Reader'; 
import List from './screen/List'; 



class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/read/:id" component={Reader} />
          <Route path="/" component={List} />
          
        </Switch>
      </Router>  
    );
  }
}

export default App;
