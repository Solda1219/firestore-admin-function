import React, { useState, useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from 'react-router-dom';

import { AuthProvider } from './Components/Firebase/auth';

import Protected from './Screens/Secret';
import GuardedRoute from './Components/ProtectedRoute';

import Dashboard from './Screens/Dashboard';
import Login from './Screens/Login';
import Scores from './Screens/Scores';
import Codes from './Screens/Codes';
import Users from './Screens/Users';
import Rllys from './Screens/Rllys';
import ApiKeys from './Screens/ApiKeys';
import RllyDetail from './Screens/RllyDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path='/login' component={Login} />
          <GuardedRoute exact path='/' component={Dashboard} />
          <GuardedRoute path='/protected' component={Protected} />
          <GuardedRoute path='/users' component={Users} />
          <GuardedRoute path='/codes' component={Codes} />
          <GuardedRoute path='/scores' component={Scores} />
          <GuardedRoute path='/rllys' component={Rllys} />
          <GuardedRoute path='/admins' component={ApiKeys} />
          <GuardedRoute path='/rlly/:id' children={<RllyDetail />} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;