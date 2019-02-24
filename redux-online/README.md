# Redux + React ❤️
react - redux 


# connet 
- HOC 
- connet делает автоматически store.dispatch 
- привязывает любой React-компонент(к пропсам) - с Redux store(State)
- В результате получаем готовые вызовы action
- UI всегда синхронизирован с состоянием


Redux работает в синхронном режиме.
Запуск и обработка reducer'ами каждого action выполнится последовательно

# Provader 
- Вершина иерархии приложения 
- Оборачивает все приложение
- Открывает доступ к store для conneсt

- Поэтому conneсt получает доступ для всего приложения с любой точки

* обертка для всего приложения 
* открывает канал conneсt и вкладывает redux-store 
* получаем доступ чтения из него на любой вложенности

import { Provider } from 'react-redux';
import { store } from './init/store';

    <Provider store = { store }>
        <Route>
            <App />
        </Route>
    </Provider>

<hr />
<h2>И так </h2>
Redux - синхронный по-умолчанию.✅
Основан на чистых фун-ях и имутабельных структур данных ✅

# Redux Middleware  
Для ассинхронных операций 
сайд-эфекты  и другие потоки данных

Redux Middleware - подключаеться в синхронный поток данных Redux и по средствам фун-и перехватчика поймает фун-и action -

# UI

- Синхронный поток данных 
<h2>onClick -> action -> reducer -> store - re-render--> UI</h2>

- Ассинхронный поток данных 
<h2>onClick -> action -> MIDDLEWARE -> reducer -> store - re-render  --> UI</h2>


* MIDDLEWARE 
- перехватывает синхронный поток и пропуская через себя все action 
- перехватывает action - obj 
- выполняет ассинхронный операции - API 
- передает action на обработку в reducer (или последний если их много передает reducer )
- он слушает нужный action ( fetchSomething ) и начинает выполнять асинхронный запрос на получение данных <b> паралельно</b> 
- он не блокирует поток данных Redux


# MIDDLEWARE
- можно просто заблокировать action что бы он не дошел до reducer 
- может новый запустить синхронный action , 
положыв данные в payload и отправить этот action - reducer на обработку 

- js фун-и 
- стают в цепочку на асинхронное выполнение chaning

- может быть любое количество MIDDLEWARE между action reducer в одном выхове - станут в цепочку 


#  В Redux  есть  MIDDLEWARE чего нет во FLUX 


# tips 

1)  Import компонентов (re-export)

в папке pages / + index.js

import Feed from './Feed';
export { Feed, ... components };

Вызываем теперь так:

import Feed from './pages/Feed';
import { Feed } from './pages';

# immutable
2) Map - это коллекция ключ-значение

import { Map } from 'immutable';

export const mockedProfile = Map({
    firstName: 'Natalia',
    lastName:  'Sabadysh',
    avatar:  'https://av..',
});



# Подключаем приложение к Redux
# types.js
export const FILL_POST= 'FILL_POST';
export const FETCH_POST_ASYNC = 'FETCH_POST_ASYNC';

# action.js
export const fillPost = (posts) => {
    return {
        type:    FILL_POST,
        payload: posts,
    };
};
export const fatchPost = () => {
    return {
        type: FETCH_POST_ASYNC,
    };
};
# reducer.js
-  Хранит список постов 

const initialState = List();

export const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case FILL_POST :
            return fromJS(action.payload);
        default: return state;
    }
};
# rootReducer.js
1)
import { postReducer } from '../posts/reducer';
export const rootReducer = combineReducers({  posts: postReducer,  });

2)
import { postReducer as posts} from '../posts/reducer';
export const rootReducer = combineReducers({  posts, });

# store.js
export const store = createStore(rootReducer, enhancedStore);

# index.js

import { Provider } from 'react-redux';
import { store } from './bus/init/store';

render(
    <Provider store = { store }>
        <Route>
            <App />
        </Route>
    </Provider>, document.getElementById('app'));



<hr />
* we are using immutable js library

import { fromJS, List } from 'immutable';

-fromJS конвертация - js-> immutable
-List- коллекция список

const initialState = List();


Задание 
заменим все значения на значения с redux

static defaultProps = {
    posts:   List(), // State - (MSTP)
    profile: mockedProfile,

    actions: { // Actions - (MDTP)
        fetchUsersAsync: () => {}, // Users
        fetchPostsAsync: () => {},// Posts
        removePostAsync: () => {},
        createPostAsync: () => {},
    },
};

# № - 4 - Поделючаем redux state к Компоненту 
# Доступ до сторе  

FLUX -  http://prntscr.com/mok93a
- получили стейт приложения 

REDUX:
* Оборачиваем в Provider
import { Provider } from 'react-redux';

* передаем store в Provider 

import { store } from './bus/init/store';
<Provider store = { store }>

  1) Provider используем Contex
  2) И компонент получит доступ 

* Компонет подключить к состоянию 

import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';

connect

# mstp
 - mstp - фун-я  достоет обьект  стояния с redux
  все state доступно первым пареметром 
  возвращает обькт 
  свойства этого обьекта попадут  props к нужному компоненту 


- достаем 

- привязываем к "пост" который возвращает обькт "mstp"

const mSTP = (state) =>({
    posts: state.posts,
})
@connect(mSTP) 

Проверить что приходит по состоянию  нам от Redux

const mSTP = (state) =>     console.log('->', state.posts )
 || ({  posts: state.posts, });


#   mDTP -
- привязываем нужные - "action"  к props


// Action
import { fatchPost } from '../../bus/posts/actions';


const mDTP = (dispatch) => ({
    actions: bindActionCreators({ fatchPost }, dispatch),
});

Связываем  -> @connect(mSTP, mDTP)

Вызываем  ( и проверяем что приходит по propas)

componentDidMount () {
    const { actions } = this.props;

    console.log('this action: ', this.props);
    actions.fatchPost(); // get list of post
}


# 5 - подкучим thunk - middleware 

Делаем завпрос к  серверу 
* изменили консоль на только в ДЕВ процесе можно будет проверить стейт

const composeEnhancers = __DEV__ && devtools ? devtools : compose;


#  Подключаем thunk

# store.js

import thunk from 'redux-thunk';

const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = __DEV__ && devtools ? devtools : compose;

const middleware = [thunk];

if (__DEV__) {
    middleware.push(logger);
}

const enhancedStore = composeEnhancers(applyMiddleware(...middleware));

export const store = createStore(rootReducer, enhancedStore);

# action.js
export const fatchPost = () => (dispatch) => {
    dispatch ({
        type: FETCH_POST_ASYNC,
    });
};

* Теперь настроим связь с сервером 

# REST  - получим все posts 
 
1) api.js

import { MAIN_URL, groupId } from './config';

export const api = {
    posts: {
        fetch () {
            return fetch(`${MAIN_URL}/feed`, {
                method:  'GET',
                headers: { 'x-no-auth': groupId, },
            });
        },
    },
};

2) index.js
export { api } from './api';

3) action.sj
import { api }  from '../../REST';

export const fatchPost = () => async (dispatch) => {
    dispatch({   type: FETCH_POST_ASYNC,  });

    const response = await api.posts.fetch();
    const result = await response.json();

    console.log('response  api ->', response); 
    console.log('result  api ->', result);
};

4) reducer.js  -  у нас уже есть метод для заполнения 

export const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case FILL_POST :  return fromJS(action.payload);
        default: return state;
    }
};

5) action.js 

export const fatchPost = () => async (dispatch) => {
    dispatch({  type: FETCH_POST_ASYNC, });

    const response = await api.posts.fetch();
    const result = await response.json();

    dispatch(fillPost(result.data))   <--- заполнили наши посты 
};



# Напишем свой Middleware  (thunk)   - 6 video 

1)
store.js - очистим и вынесем все в отдельный фолдер

import { createStore } from 'redux';

// Reducer
import { rootReducer } from './rootReducer';

// Enhancer
import { enhancedStore } from './middleware/core';

export const store = createStore(rootReducer, enhancedStore);

2) 
MiddleWare core.js - вынесли все сюда ( со store.js )
// Core
import { applyMiddleware, compose } from 'redux';

//Middleware
import { createLogger } from 'redux-logger';
import { customThunk } from './custom';

const logger = createLogger({
    duration:  true,
    collapsed: true,
    collors:   {
        title:     () => '#139BFE',
        prevState: () => '#1C5FAF',
        action:    () => '#149945',
        nextState: () => '#A47104',
        error:     () => '#ff0005',
    },
});

const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = __DEV__ && devtools ? devtools : compose;
const middleware = [ customThunk];
if (__DEV__) {  middleware.push(logger);}
const enhancedStore = composeEnhancers(applyMiddleware(...middleware));

export { enhancedStore }; <- сразу же експортируем, что бы потом вызвать по имени 

*
Задача  middleware запучкать actons а именно async (dispatch) ->
<b>export const fatchPost = () => async (dispatch) => {.. </b>

3) сostom.js 
export function customThunk (store) {
    return function (next) {
        return function (action) {
            if (typeof action === 'function') { return action(store.dispatch, store.getState); }
            console.log('-> custom thunk', store.getState(), action);
            return next(action);
        };
    };
}



ДЗ
- создание нового поста Composer _onSubmit (create new post, submitPost)

- Composer action ={ actiom } от компонента Posts  а Постс получает от connect
-  + api  запрос 

export const types = {
    //Sync
    FILL_POSTS:   'FILL_POSTS',
    CREATE_POSTS: 'CREATE_POSTS',

    //Async
    FETCH_POSTS_ASYNC: 'FETCH_POSTS_ASYNC',
    CREATE_POST_ASYNC: 'CREATE_POST_ASYNC',
};

actions.js

//Types
import { types } from './types';

//Instruments
import { api } from '../../REST';

export const postsActions = {
    fillPosts: (posts) => {
        return {
            type:    types.FILL_POSTS,
            payload: posts,
        };
    },
    createPost: (post) => {
        return {
            type:    types.CREATE_POSTS,
            payload: post,
        };
    },
    fetchPostsAsync: () => async (dispatch) => {
        dispatch({
            type: types.FETCH_POSTS_ASYNC,
        });

        const response = await api.posts.fetch();
        const result = await response.json();

        dispatch(postsActions.fillPosts(result.data));
    },
    createPostAsync: (comment) => {
        return {
            type:    types.CREATE_POST_ASYNC,
            payload: comment,
        };
    },
};

reducer.js
 case types.FILL_POSTS:  return fromJS(action.payload);
 case types.CREATE_POSTS:  return state.unshift(fromJS(action.payload));
 default: .. 


Composer.js
  this.props.actions.createPostAsync(comment);


Posts.js
   actions: bindActionCreators({ fetchPostsAsync: postsActions.fetchPostsAsync, createPostAsync: postsActions.createPostAsync }, dispatch),
  


  # Отлов ошибок - componentDidCatch - life cycle React 
   - Если у дочерних компонентов что то сломаеться То он впоймает , и покажет запосной UI 