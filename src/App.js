// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RSSFeedConfig from './components/RSSFeedConfig';
import GeneratePosts from './components/GeneratePosts';
import AdminPanel from './components/AdminPanel';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/rss-config" component={RSSFeedConfig} />
        <Route path="/generate-posts" component={GeneratePosts} />
        <Route path="/admin" component={AdminPanel} />
        <Route path="/" component={Login} />
      </Switch>
    </Router>
  );
};

export default App;
