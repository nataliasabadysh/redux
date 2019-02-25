// Core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';

import { Switch, Redirect, Route, withRouter } from 'react-router-dom';

// Pages
import { Feed, Login, Signup, Profile, NewPassword } from '../pages';

import { book } from './book';

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.get('isAuthenticated'),
});

@hot(module)
@withRouter
@connect(mapStateToProps)

export default class App extends Component {
    render () {
        const { isAuthenticated } = this.props;

        return isAuthenticated ? (
            <Switch>
                <Route component = { Profile } path = { book.profile } />
                <Route component = { NewPassword } path = { book.newPassword } />
                <Route component = { Feed } path = { book.feed } />
                <Redirect to = { book.feed } />
            </Switch>
        ) : (
            <Switch>
                <Route component = { Login } path = { book.login } />
                <Route component = { Signup } path = { book.signUp } />
                <Redirect to = { book.login } />
            </Switch>
        );
    }
}
