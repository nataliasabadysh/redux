// Core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

// Instruments
import Styles from './styles.m.css';
import { book } from '../../navigation/book';

// Actions
import { authActions } from '../../bus/auth/actions';


const mSTP = (state) => ({
    isAuthenticated: state.auth.get('isAuthenticated'),
    profile:         state.profile,
});
const mDTP = {
    logoutAsync:authActions.loginAsync,
}

@connect(mSTP, mDTP)
export default class Nav extends Component {
    static defaultProps = {
        // State
        isOnline: false,

        // Actions
       //  logoutAsync: () => {},
    };

    _getNav = () => {
        const { isAuthenticated, profile } = this.props;

        return isAuthenticated ?
            <>
                <div>
                    <NavLink activeClassName = { Styles.active } to = { book.profile }>
                        <img src = { profile.get('avatar') } />
                        {profile.get('firstName')}
                    </NavLink>
                    <NavLink activeClassName = { Styles.active } to = { book.feed }>
                        Feed
                    </NavLink>
                </div>
                <button onClick = { this._logout }>Logout</button>
            </>
            :
            <>
                <div>
                    <NavLink activeClassName = { Styles.active } to = { book.login }>
                        Sing in
                    </NavLink>
                    <NavLink activeClassName = { Styles.active } to = { book.signUp }>
                        New account
                    </NavLink>
                </div>
                <button className = { Styles.hidden }>Logout</button>
            </>
        ;
    };

    _logout = () => {
        this.props.logoutAsync();
    };

    render () {
        const { isOnline } = this.props;

        const navigation = this._getNav();
        
        const statusStyle = cx(Styles.status, {
            [Styles.online]:  isOnline,
            [Styles.offline]: !isOnline,
        });

        return (
            <section className = { Styles.navigation }>
                <div className = { statusStyle }>
                    <div>{isOnline ? 'Online' : 'Offline'}</div>
                    <span />
                </div>
                {navigation}
            </section>
        );
    }
}
