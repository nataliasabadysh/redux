// Core
import { put, apply } from 'redux-saga/effects';

// Indtruments
import { api } from '../../../../REST';
import { authActions } from '../../../auth/actions';
import { uiActions } from '../../../ui/actions';
import { profileActions } from '../../../profile/actions';

export function* login ({ payload: credentials }) {
    try {
        yield put(uiActions.startFetching());

        const response =  yield apply(api, api.auth.login, [credentials]);
        const { data: profile, message } = yield apply(response, response.json);

        if (response.status !== 200) {
            throw new Error(message);
        }
        console.log('profile', profile);

        yield put(profileActions.fillProfile(profile));
        yield put(authActions.authenticate());

    } catch (error) {
        yield put(uiActions.emitError(error, 'Singup worker'));

    } finally {
        yield put(uiActions.stopFetching());
    }
}
