// Core
import { createStore } from 'redux';

// Root
import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';

//Middleware
import { enhancedStore, sagaMiddleware } from './middleware/core';

export const store =  createStore(rootReducer, enhancedStore);

sagaMiddleware.run(rootSaga);
