№ 5 

Практика 

теперь используем middleware Saga ( а не thunk )

1) Соберем всех вотчеров приложении в RootSaga.js

RootSaga.js - корень структуры 

export function* rootSaga(){
    yield console.log('init saga');
}

2)
core.js

import createSagaMiddleware from 'redux-saga';
const sagaMiddleware = createSagaMiddleware(); // получили экземпляр сага мидлеваре
const middleware = [sagaMiddleware, customThunk];
export { enhancedStore , sagaMiddleware};


3)
store.js
import { rootSaga } from './rootSaga';
import { enhancedStore, sagaMiddleware } from './middleware/core';
.. 
sagaMiddleware.run(rootSaga);

# Saga 

bus
    posts 
        -> saga 
                ->  watcher.js
                    workers
                        -> index.js
                        -> createPost.js

# watcher.js
- effects - Это инструкции , с помошью которых сага сможет выполнять effects
- takeEvery - take every возмет
- all будет соберать остальных watcher sag этого доменна
    - он прнемает массив 
    - где каждый элемент Вотчер-сага- фун-я
- call - преднозначен для вызова фун-и 
    - 


1)
// Core
import { takeEvery, all, call } from 'redux-saga/effects';

// Type
import { CREATE_POST_ASYNC } from '../types';

// Workers
import { createPost } from './workers';

export function* watcherCreatePost () {
    yield takeEvery(CREATE_POST_ASYNC, createPost);
}

2) Применим all

function* watcherCreatePost () {
    yield takeEvery(CREATE_POST_ASYNC, createPost);
}
export function* watchPost () {
    yield all([ watcherCreatePost() ]);
}

3) Добавим call

export function* watchPost () {
    yield all([call(watcherCreatePost)]);
}


# rootSaga

// Watcer 
import { watcherCreatePost } from '../../bus/posts/saga/watcher';

2) вместе с all  watchers

import { watchPost } from '../../bus/posts/saga/watcher';
export function* rootSaga () {
    yield watchPost();
}

3) Добавим Эффекты Саги

// Core
import { all, call } from 'redux-saga/effects';

// Watcer
import { watchPost } from '../../bus/posts/saga/watcher';

export function* rootSaga () {
    yield all([call(watchPost)]);
}


#  createSaga

action.js
export const createPostAsync = (comment) => async (dispatch) => {
    dispatch({
        type: CREATE_POST_ASYNC,
    });

    const response = await api.posts.create(comment);
    const result = await response.json();

    dispatch(createPost(result.data));
};

1) createSaga.js
Перенесем в createSaga.js + effects

import { put, apply } from 'redux-saga/effects';
import { api } from '../../../../REST';

import { createPost as createPostAc } from '../../actions';

export function* createPost (action) {
    const comment = action.payload;

    const response =  yield apply(api, api.posts.create, [comment]);
    const result =    yield apply(response, response.json);

    yield put(createPostAc(result.data));
}
*** 
Деструктурируем параметры  ({ payload: comment })

export function* createPost ({ payload: comment }) {
    const response =  yield apply(api, api.posts.create, [comment]);
    const result =    yield apply(response, response.json);

    yield put(createPostAc(result.data));
}


2)  action.js

export const createPostAsync = (comment) => ({
    type:    CREATE_POST_ASYNC,
    payload: comment,               // доступ к тексту
});



# effects 
// Core
import { put, apply } from 'redux-saga/effects';
 - put   - = store.dispatch
    - запускает actions из worker saga 

-  apply  - (call) - вызывает указанную фун-ю 
    - лучше подходит для вызовов асинхронных фун-й 
    - помогает сохранить контекст этого метода 

# Конфликт имен 
createPost 

import { api } from '../../../../REST';
import { createPost } from '../../actions';

export function* createPost (action) {
    yield console.log('-> createPost saga', action);
}


#  Улучшем структуру доменна 

1) Posts - type.js

export const FILL_POST= 'FILL_POST';
export const CREATE_POST = 'CREATE_POST';
export const FETCH_POST_ASYNC = 'FETCH_POST_ASYNC';
export const CREATE_POST_ASYNC = 'CREATE_POST_ASYNC';

Замение на 

export const types = {
    FILL_POST:   'FILL_POST',
    CREATE_POST: 'CREATE_POST',
    FETCH_POST_ASYNC:  'FETCH_POST_ASYNC',
    CREATE_POST_ASYNC: 'CREATE_POST_ASYNC',
};

action.js импортируем теперь так 

import { types } from './types';

export const fillPost = (posts) => ({
    type:    types.FILL_POST,               <--- calling the action types
    payload: posts, // привязываем данные о постах

});

1) Posts - actions.js
- обьеденим все сушьности в один обьект

<h2>то есть </h2>

export const fillPost = (posts) => ({
    type:    types.FILL_POST,
    payload: posts, // привязываем данные о постах

});

export const createPost = (posts) => ({
    type:    types.CREATE_POST,
    payload: posts, //  данные о посте
});

<h2>в такую запись </h2>

export const postActions = {
    fillPost: (posts) => ({
        type:    types.FILL_POST,
        payload: posts, 

    }),
    createPost: (posts) => ({
        type:    types.CREATE_POST,
        payload: posts, 
    }),
}

Posts.js вызываем метод 

import { postActions } from '../../bus/posts/actions';

const mDTP = (dispatch) => ({
    actions: bindActionCreators({
        fatchPostAsync:  postActions.fatchPostAsync,
        createPostAsync: postActions.createPostAsync,
    }, dispatch),
});

createPost.js
import { postActions } from '../../actions';

export function* createPost ({ payload: comment }) {
    const response =  yield apply(api, api.posts.create, [comment]);
    const result =    yield apply(response, response.json);

    yield put(postActions.createPost(result.data));  <-- postActions.createPost
}

* деструктурируес отпет от сервера 
 const result =    yield apply(response, response.json);

 на 
     const { data, message} = yield apply(response, response.json);
    yield put(postActions.createPost(data));

* деструктурируес  c переименновыванием 
    const { data: post, message} =    yield apply(response, response.json);
    yield put(postActions.createPost(post));


+ Добавим отлов ошибок 

export function* createPost ({ payload: comment }) {
    try {
        const response =  yield apply(api, api.posts.create, [comment]);
        const { data: post, message } =    yield apply(response, response.json);

        if (response.status !== 200) {
            throw new Error(message);
        }

        yield put(postActions.createPost(post));
    } catch (error) {
        console.log('CreatePost worker', error);

    }
}

# Сделаем Шаблонный домен 
__DOMEN__

    types.js
export const types = { TYPE: 'TYPE', }

    action.js
import { types } from './types';
export const actions = { 
        actions: () => ({ type: types.TYPE, }), 
};

    reducer.js
import {types} from './types';
const initialState = {};

export const reducer = { state = initialState, action } => {
    switch(action.types){
        case types.TYPE: return state;
        default: return state;
    }
}


# spinner - ui
 1)types.js

 export const types = {
    START_FETCHING: 'START_FETCHING',
    STOP_FETCHING: 'STOP_FETCHING',
}
2) action.js

export const uiAtions = {
    startFatching: () => ({
        type: types.START_FETCHING, // on спиннер
    }),
    stopFatching: () => ({
        type: types.STOP_FETCHING, // off спиннер
    }),
};
3) reducer,js

import { Map } from 'immutable';
import { types } from './types';

const initialState = Map({
    isFatching: false,
});

export const uiReducer = (state = initialState, action) => {
    switch (action.types) {
        case types.START_FETCHING:
            return state.set('isFatching', true);

        case types.STOP_FETCHING:
            return state.set('isFatching', false);

        default:
            return state;
    }
};
4) rootReducer.js

import { uiReducer as ui } from '../ui/reducer';

export const rootReducer = combineReducers({
    posts,
    ui,
});

5) теперь применим спиннер Redux 
createPost.js

import { uiAtions } from '../../../ui/actions';

export function* createPost ({ payload: comment }) {
    try {
        yield put(uiAtions.startFatching()); //< -- в начале worker saga
        const response =  yield apply(api, api.posts.create, [comment]);
        const { data: post, message } =    yield apply(response, response.json);
        if (response.status !== 200) { throw new Error(message);}
        yield put(postActions.createPost(post));
    } catch (error) {
        console.log('CreatePost worker', error);
    } finally {
        yield put(uiAtions.stopFatching()); // < --- в крнце worker saga
    }
}

6) подключим к Компоненту 

// Core
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Instruments
import Styles from './styles.m.css';


const mSTP = (state) =>({
    isFetching: state.ui.get('isFetching'), // get - плучим свойства (false)
});

@connect(mSTP)// spinner есть доступ к настаящему state сейчас

export default class Spinner extends Component {
    render () {
        const { isFetching } = this.props;

        return isFetching ? <div className = { Styles.spinner } /> : null;
    }
}


# action для обработки ошибок 
1)
    EMIT_ERROR: 'EMIT_ERROR',
2)
    emitError: (error, meta=null)=>({
        type: types.EMIT_ERROR,
        payload: error,
        error: true,
        meta,
    })
3)
catch (error) {
        yield put(uiAtions.emitError(error, 'CreatePost worker'))


//HW- all posts from thunk to saga 
