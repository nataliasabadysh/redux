// Core
import { fromJS, List } from 'immutable';

// Instruments
import { FILL_POST, CREATE_POST } from './types';

const initialState = List();

export const postReducer = (state = initialState, action) => {
    switch (action.type) {

        case FILL_POST :
            return fromJS(action.payload);

        case CREATE_POST :
            return state.unshift(fromJS(action.payload));

        default: return state;
    }
};
