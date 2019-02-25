№ 6
# Маршрутизация в Redux + auth from state 

# App.js
<p> import { Switch, Redirect, Route, withRouter } from 'react-router-dom'; </p>
<p> import { Feed, Login, Signup, Profile, NewPassword } from '../pages'; </p>
<p> import { book } from './book';</p>

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.get('isAuthenticated'),
});

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

- privet / poblic routes, (isAuthenticated true/false)

* Book.js
export const book = Object.freeze({
    login:       '/login',
    signUp:      '/sign-up',
    feed:        '/feed',
});

# Nav.js  - Component

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.get('isAuthenticated'),
    profile:         state.profile,
});

@connect(mapStateToProps)
export default class Nav extends Component {
    ..
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
                        Стена
                    </NavLink>
                </div>
                <button onClick = { this._logout }>Выйти</button>
            </>
            :
            <>
                <div>
                    <NavLink activeClassName = { Styles.active } to = { book.login }>
                        Войти
                    </NavLink>
                    <NavLink activeClassName = { Styles.active } to = { book.signUp }>
                        Создать аккаунт
                    </NavLink>
                </div>
                <button className = { Styles.hidden }>Выйти</button>
            </>
        ;
    };
    render () {
        const navigation = this._getNav();

        return (
            <section className = { Styles.navigation }>
                {navigation}
            </section>
        );
    }



# Public / Privet Routes   Сделаем на redux- saga " isAuthenticated " 




# auth 
1) types
<p>
export const types = {
    AUTHENTICATE: 'AUTHENTICATE', //  для reducer  ( true/ false )
    SINGUP_ASYNC: 'SINGUP_ASYNC', // for Saga - watcher -> to worker
    LOGIN_ASYNC: 'LOGIN_ASYNC', };
</p>




2) action

export const authActions = {
    authenticate: () => ({
        type: types.AUTHENTICATE,
    }),

    singupAsync: (userData) => ({
        type:    types.SINGUP_ASYNC,
        payloda: userData,
    }),
};
* Эти данные мы отправим на сервер для регестрации

3) reducer 

import { Map } from 'immutable';
import { types } from './types';

const initialState = Map({
    isAuthenticated: false,
});
export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.AUTHENTICATE: 
            return state.set('isAuthenticated', true);
       ..
    }
};
4) roodReducer

import { authReducer as auth } from '../auth/reducer';
export const rootReducer = combineReducers({
    auth,  < ----   
    ui,
    posts,
});
5) В Компонент

import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.get('isAuthenticated'),
});

@connect(mapStateToProps)

* Ткпкрь нам больше не нужна заглишка , теперь доступно с состояния isAuthenticated: true,

    static defaultProps = {
        // State
        profile:         mockedProfile,
        isAuthenticated: true,  <  ---- удаляем 
        isOnline:        false,

        // Actions
        logoutAsync: () => {},
    };

# @connect - блокирует роуты если применить в App.js  (баг)
 withRouter - поможет решить этот вопрос 

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Switch, Redirect, Route, withRouter } from 'react-router-dom';

// Pages
import { Feed, Login, Signup, Profile, NewPassword } from '../pages';

import { book } from './book';

@withRouter
@connect()

- теперь райты работают 
- connetc подключем 
- и мы получаем доступ к приватным и публичным роутам 

# privet/ public routes
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
# регестрация пользователя  - видео 3

- Formik 
    - signupAsync
    - authActions
    - 

# SignupForm.js

у нас есть 

    static defaultProps = {
        // State
        isFetching: false,

        // Actions
        signupAsync: () => {},
    };
Заменим , привязав попрос с redux  signupAsync /  isFetching

+ isFetching
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
    isFetching: state.ui.get('isFetching'),
});

+ actions
import { authActions } from '../../bus/auth/actions';

const mapDispatchToProps = {
    signupAsync: authActions.signupAsync,
};

* mapDispatchToProps 
-  используем в виде obj а не фун-ю 
- если нам не нужно вкладиввать во вложенный обькт  


# saga + регестрация пользователя  
# Нужно отправить запрос 
# watcher.js

function* watchSignup () {
    yield takeEvery(types.SINGUP_ASYNC, signup);
}

export function* watchAuth () {
    yield all([
        call(watchSignup)
    ]);
}
* будем следить за action "SINGUP_ASYNC" - которая запускаеться в signupForm 

* new worker signup

# rootSaga.js

import { watchAuth } from '../../bus/auth/saga/watcher';

export function* rootSaga () {
    yield all([.., call(watchAuth)]);
}

# hhtp api 
DOC Baackend  https://lab.lectrum.io/docs/redux/
POST
https://lab.lectrum.io/redux/api/user/{groupId}

URI parameters  - groupId
Body:           - это obj при отправки form signup
Example value: {
  "firstName": "Jon",
  "lastName": "Doe",
  "email": "j.doe@example.com",
  "password": "abc123456ABC",
  "invite": "abc1234567"
}

# api

    auth: {
        signup (userInfo) {
            return fetch(`${MAIN_URL}/user/${groupId}`, {
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json', // comment to json
                },
                body: JSON.stringify({ userInfo }),
            });
        },
    },

# worker.js (signup.js)

import { api } from '../../../../REST';
import { authActions } from '../../../auth/actions';
import { uiActions } from '../../../ui/actions';


export function* worker ({ payload: userInfo }) {
    try {
        yield put(uiActions.startFetching());
        yield put(authActions.authenticate());

        const response =  yield apply(api, api.auth.signup, [userInfo]);
        const { data: profile, message } = yield apply(response, response.json);

        if (response.status !== 200) { throw new Error(message);}
    } catch (error) {
        yield put(uiActions.emitError(error, 'Singup worker'));

    } finally {
        yield put(uiActions.stopFetching());
    }
}




# PROFILE
export const types = {
    FILL_PROFILE: 'FILL_PROFILE',
}

export const profileActions = {
    fillProfile: (profile) => ({
        type:    types.FILL_PROFILE,
        payload: profile,               <--- profile 
    }),
};
3) profileReducer

const initialState = Map({
    id:        '',
    firstName: '',
    lastName:  '',
    avatar:    '',
    token:     '',
});

export const profileReducer = (state = initialState, action) => {
    switch (action.types) {
        case types.FILL_PROFILE: 
            return state.merge(action.payload);
        default:
            return state;
    }
};

4) rootReducer
import { profileReducer as profile } from '../profile/reducer';

export const rootReducer = combineReducers({
    auth,
    ui,
    posts,
    profile,
});

5) signup.js ( worker saga)
import { profileActions } from '../../../profile/actions';


        yield put(profileActions.fillProfile(profile));
- Этот action загрузит настоящме данные о профиля пользователя в редах 
6) Компонент - Composer  - плучает данные по пропам от Posts 

В
 - Posts.js
 - Nav.js 
 
const mSTP = (state) => ({
    ... 
    profile: state.posts,  < --- 
});




# saga method dalay 

import { delay } from 'redux-saga';
yield delay(2000);


isFetching

// Config
export const ROOT_URL = 'https://lab.lectrum.io';
export const MAIN_URL = `${ROOT_URL}/redux/api`;

export const groupId = 'algroktvgc9z';

export const invite = 'EgKsIZfkp7mc';

// Для тестов вебсокета: `qmhjqBMeYwhp` ;
// токен для фейсбука: `EgKsIZfkp7mc`
// токен для персонального проекта `oZjnbqPdNfU5cft6`

// Web/Api  - https://lab.lectrum.io/docs/redux/#/docs/resources-5-methods-0