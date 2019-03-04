# Private.js  Route

// Core
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Pages
import { Feed, Profile, NewPassword } from '../pages';

//Instruments
import { book } from './book';

export default class Private extends Component {
    render () {
        return  (
            <Switch>
                <Route component = { Feed } path = { book.feed } />
                <Route component = { Profile } path = { book.profile } />
                <Route component = { NewPassword } path = { book.newPassword } />
                <Redirect to = { book.feed } />
            </Switch>
        ) 
    }
}


# Public.js
// Core
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Pages
import { Login, Signup } from '../pages';

//Instruments
import { book } from './book';

export default class Public extends Component {
    render () {
        return (
            <Switch>
                <Route component = { Login } path = { book.login } />
                <Route component = { Signup } path = { book.signUp } />
                <Redirect to = { book.login } />
            </Switch>
        )
    }
};

# App.js
// Core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withRouter } from 'react-router-dom';

// Routes
import Private from './Private';
import Public from './Public';

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.get('isAuthenticated'),
});

@hot(module)
@withRouter
@connect(mapStateToProps)

export default class App extends Component {
    render () {
        const { isAuthenticated } = this.props;

        return isAuthenticated ? <Private /> : <Public />;
    }
}
# jwt token - сохраним в localStorage

in LS-после получения профайла логин пользователя

  localStorage.setItem('token', profile.token); 

// http://prntscr.com/mpuhbo

перепишим на saga
yield apply(localStorage.setItem['token', profile.token]);

// http://prntscr.com/mpuivc

+ API

    get token(){
        return localStorage.setItem('token'); 
    },
    auth: {
        ...
        authenticate () {
            return fetch(`${MAIN_URL}/user/login`, {
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: this.token }),
            });
        },
    }

+ Для вызова воркер сага

AUTHENTICATE_ASYNC: 'AUTHENTICATE_ASYNC',

authenticateAsync: () => ({
    type: types.AUTHENTICATE_ASYNC,
}),
+ worker

..


    export function* authenticate () {

    try {
        yield put(uiActions.startFetching());

        const response = yield apply(api, api.auth.authenticate);
        const { data: profile, message } = yield apply(response, response.json);

        if (response.status !== 200) {
            throw new Error(message);
        }
        yield apply(localStorage.setItem['token', profile.token]); 

        yield put(profileActions.fillProfile(profile));
        yield put(authActions.authenticate());

..
}
+ watcher Saga
export function* watchAuthenticate () {
    yield takeEvery(types.AUTHENTICATE_ASYNC, authenticate);
}
 App.js

import { authActions } from '../bus/auth/actions'; /// Actions

const mSTP = (state) => ({
    isAuthenticated: state.auth.get('isAuthenticated'),
});
const mDTP = {
    authenticateAsync: authActions.authenticateAsync,
};

   componentDidMount () {
        this.props.authenticateAsync();
    }
<h1>Добавим при ассихнронный загрузки спинер 😀😀</h1>

# доп инициализация . уберем мертвую точку  (4 - видео)

между отправкой запроса на authenticateAsync и плучения (любого) ответа от сервера 

Хорошо это видно при медленном интернете 
Добавим доп шаг к инициализации 

# App.js
import { Loading } from '../components';

        const isInitialized = false;

          if (!isInitialized) {
            return <Loading />;
        }
** когда isInitialized = true отрендериться все приложение 
Реализуем поведение 
1)
 auth
    types.js
            INITIALIZE: 'INITIALIZE',
            INITIALIZE_ASYNC: 'INITIALIZE_ASYNC',

    action.js
            initializeAsync: () => ({
                type: types.INITIALIZE_ASYNC,
            }),
            initialize: () => ({
                type: types.INITIALIZE,
            }),

    reducer.js
            case types.INITIALIZE:
                return state.set('isInitialized', true);
2)
App.js

const mSTP = (state) => ({
    isAuthenticated: state.auth.get('isAuthenticated'),
    isInitialized: state.auth.get('isInitialized')
});

const mDTP = {
    // authenticateAsync: authActions.authenticateAsync,
    initializeAsync: authActions.initializeAsync,
};
    componentDidMount () {
        this.props.initializeAsync(); // authenticateAsync
    }

render () {
        const { isAuthenticated, isInitialized } = this.props;
        if (!isInitialized) { return <Loading />;  }
3)
* Обработаем этот акшион новой сагой инициализации *
worker.js (isInitialized.js)  - authActions_Async - вызовим здесь при инициализации

import { put, apply } from 'redux-saga/effects';
import { authActions } from '../../../auth/actions';

export function* initialize () {

        const token = yield apply(localStorage, localStorage.getItem, ['token'] );
        
        if(token) {   yield put(authActions.authenticateAsync());  }
        else{         yield put(authActions.initialize());         } 
};

- если токен есть то делаем authenticateAsync
- а если нет то initialize приложение (и тем самым убрать экран загрузки )
4)
re-export index.js
export { initialize } from './initialize';
5)
Зарегестрируем в watcherSaga 

//Workers
import { signup, login, authenticate, initialize } from './workers';

export function* watchInitialize () {
    yield takeEvery(types.INITIALIZE_ASYNC, initialize);
}

6)
А если токе не валиный или устарел Нам же в любому случаи нужно выключить спиннер 
worker.js (authenticate.js)
..
finally {
        yield put(uiActions.stopFetching());
        yield put(authActions.initialize());  <-- 
    }

#  Запоминать пользователя между перезагрузкой страницы  по нажатию checkbox -ЗАПОМНИТЬ МЕНЯ  (video - 5 )

   <label>
   <Field checked = { props.values.remember } name = 'remember'  type = 'checkbox' />  Keep me signed in
    </label>

login.js - добавим условие , по которому добовляем в  LS 


if (credentials.remember) {
     yield apply(localStorage, localStorage.setItem['remember', true]);  
        }

Теперь добавим Cчтение из - LS

worker.js (initialize.js)

     const remember = yield apply(localStorage, localStorage.getItem, ['remember'] );
       
if(token && remember) {
        yield put(authActions.authenticateAsync()); }
 else{  yield put(authActions.initialize()); }


* * Попутка authenticate поизойдет при условии этих двух условий 
1) Пользователь залогинеля на сайте хоть один раз 
2) в момент логина чекбокс был выбран 


api.js - теперь имя и данные пост будут соотвецтвовать

headers: {
    'Authorization': this.token,
 },

 # Logout  (v - 6)

<b> Нам нужно сделать изменить isInitialized => false  </b>

1) types
<p>   LOGOUT: 'LOGOUT', - для обраюотки редьюсером </p>
<p>   LOGOUT_ASYNC: 'LOGOUT_ASYNC', - для запуска Саги </p>

2) actions
<p>  logout: () => ({ type: types.LOGOUT, }),  </p>
<p>  logoutAsync: () => ({ type: types.LOGIN_ASYNC, }),  </p>

3) reducer 
<p> case types.LOGOUT: return state.set('isAuthenticated', false);  </p>

4) Nav.js

<p>  import { authActions } from '../../bus/auth/actions'; </p>
<p>  const mDTP = { logoutAsync:authActions.loginAsync,} </p>

<p>  Полученный стейт привязываем к методу в классе , что бы вызвать на кнопке  </p>
<p>  _logout = () => {  this.props.logoutAsync(); };  </p>

5) API что бы выйти из системы , нужен запрос к серверу 

<p>  


    logout () {

    return fetch(`${MAIN_URL}/user/logout`, {

        method:  'GET',

        headers: {  'Authorization': this.token, },
    });
},


</p>

6) Saga worker logout.js

<p>  

    export function* logout () {

        try {

            yield put(uiActions.startFetching());

            const response = yield apply(api, api.auth.logout );

            if (response.status !== 204) { // status code for Logout 
                const { message } = yield apply(response, response.json);
                throw new Error(message);
            }

        } catch (error) {
            yield put(uiActions.emitError(error, '-> Logout worker'));
        } finally {
            yield put(uiActions.stopFetching());
            yield put(authActions.logout());
        }
    }
 </p>

- на успешный фетч бэкэнд не присылает ничего в ответ ,
- но на ошибку !204 то сервер пришлет обькт с полем месседж

- здесь проверяем на ответ от сервера == 204

8) re-expors  -> export { logout } from './logout';

7) watcher.js
<p> function* watchLogout () { yield takeEvery(types.LOGOUT_ASYNC, logout);   } </p>

#  logout- мы вышли, а стейт остался с постами и данными  ( state = LS, profile, post )

- Очистим  posts

<p>   CLEAR_POSTS: 'CLEAR_POSTS',   </p>
<p>  clearPost: () => ({  type: types.CLEAR_POSTS, })  </p>
<i>  при его запуске вызовим state.clear imutable.js  </i>
<p>  case types.CLEAR_POSTS: return state.clear();// state - empty   </p>

- Очистим  profile

<p> CLEAR_PROFILE: 'CLEAR_PROFILE',  </p>
<p> clearProfile: () => ({  type: types.CLEAR_PROFILE, }) </p>
<p> case types.CLEAR_PROFILE: return state.clear(); </p>

- worker logout.js ( for clean LS, profile-action, post-action )

<p>  finally {
        <p>  yield apply(localStorage, localStorage.removeItem, ['toke']); </p>
        <p>  yield apply(localStorage, localStorage.removeItem, ['remember']); </p>
        <p>  yield put(profileActions.clearProfile());  </p>
        <p>  yield put(postsActions.clearPost());   </p>
</p>

# react-router-redux  (video-7)
# для хранения и управления состоянием Routing  in state  Redux
- предоставляет готовый reducer - routerReducer
-
- 
1)

rootReducer.js
 import { routerReducer as router } from 'react-router-redux';

export const rootReducer = combineReducers({
    ..
    router,
});

2) create middleware 
core.js
import{ createBrowserHistory } from 'history';
import { routerMiddleware as createRouterMiddleware} from 'react-router-redux'

const history = createBrowserHistory();
const routerMiddleware = createRouterMiddleware(history);

const middleware = [sagaMiddleware, customThunk, routerMiddleware];
export { enhancedStore, sagaMiddleware , history };

3) index.js
import { ConnectedRouter as Router } from 'react-router-redux';
import { history } from './init/middleware/core';

      <Router history= { history } >

http://prntscr.com/msm8wh  - Console 
http://prntscr.com/msm983  - Redux state 


<h1>Запустим наш action в явном виде </h1>

logout.js

import { replace } from 'react-router-redux';
import { book } from '../../../../navigation/book';

yield put(replace(book.login));     

*replace  
- заменит текуший адрес браузера 
- без возможности сделать шаг назад 

* react-router-redux -Нужен когда нужно сменить роут в глубокой операции приложении
- очень удобно работать с понятным и распишанными шагами в прмложении 


# Token живет 4 часа  (видео-8)

-  работает с устаревшими токенами в приложении (401 - error status)
-  если статус 401 то очистим  removeItem, ['toke']);  и ['remember']);
- что бы приложение больше не пыталось аунтефицироваться 
- return null; для того что бы выйти из блока try 

authenticate.js


        if ( response.status !== 200 ) {
            if ( response.status === 401 ) {
                yield apply(localStorage, localStorage.removeItem, ['toke']);
                yield apply(localStorage, localStorage.removeItem, ['remember']);

                return null;
            }
            throw new Error(message);
        }

# deete posts




<p>   </p>
<p>   </p>
<p>   </p>
<p>   </p>
<p>   </p>
<p>   </p>
<p>   </p>
<p>   </p>