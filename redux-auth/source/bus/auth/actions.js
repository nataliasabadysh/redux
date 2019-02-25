// Types
import { types } from './types';

export const authActions = {
    // Sync
    authenticate: () => ({
        type: types.AUTHENTICATE,
    }),

    // Async
    signupAsync: (userData) => ({
        type:    types.SINGUP_ASYNC,
        payload: userData,
    }),

    loginSaync: (credentials) => ({
        type:    types.LOGIN_ASYNC,
        payload: credentials,
    }),
};
