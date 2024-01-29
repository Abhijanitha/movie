import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Movies from "./components/movies";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import LoginForm from "./components/loginForm";
import Logout from './components/logout';
import RegisterForm from "./components/registerForm";
import MovieForm from "./components/movieForm";
import auth from './services/authService'
import ProtectedRoute from './components/common/protectedRoute'
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

class App extends Component {
  state = {};

  componentDidMount() {
    const user=auth.getCurrentUser();
    this.setState({user});
  }

  render() {
    const {user}=this.state;
    return (
      <>
        <ToastContainer />
        <NavBar user={user}/>
        <main className="container">
          <Switch>
            <Route path="/login" component={LoginForm}></Route>
            <Route path="/logout" component={Logout}></Route>
            <Route path="/register" component={RegisterForm}></Route>
            <Route path="/movies/new" component={MovieForm}></Route>
            <Route path="/movies/:id" component={MovieForm}/>
            <Route 
            path="/movies" exact 
            render={props=><Movies {...props} user={this.state.user}/>
            }>
            </Route>
            <Route path="/customers" component={Customers}></Route>
            <Route path="/rentals" component={Rentals}></Route>
            <Route path="/not-found" component={NotFound}></Route>
            <Redirect from="/" exact to="/movies" />
          </Switch>
        </main>
      </>
    );
  }
}

export default App;
