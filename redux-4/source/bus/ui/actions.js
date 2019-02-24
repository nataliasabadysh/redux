// Types
import { types } from './types';

export const uiAtions = {
    startFetching: () => ({
        type: types.START_FETCHING, // on спиннер
    }),
    stopFetching: () => ({
        type: types.STOP_FETCHING, // off спиннер
    }),
    emitError: (error, meta=null) => ({
        type:    types.EMIT_ERROR,
        payload: error,
        error:   true,
        meta,
    }),

};
