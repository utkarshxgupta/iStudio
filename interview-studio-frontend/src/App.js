import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Shared/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./components/Admin/Dashboard";
import CreateTest from "./components/TestCreator/CreateTest";
import TestAttempt from "./components/Candidate/TestAttempt";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={CreateTest} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={AdminDashboard} />
        <Route path="/test/:assignmentId" component={TestAttempt} />
      </Switch>
    </Router>
  );
};

export default App;
