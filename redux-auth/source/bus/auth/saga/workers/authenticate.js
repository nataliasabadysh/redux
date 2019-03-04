//Core
import { put, apply } from 'redux-saga/effects';

//Instruments
import { api } from '../../../../REST';
import { authActions } from '../../../auth/actions';
import { uiActions } from '../../../ui/actions';
import { profileActions } from '../../../profile/actions';

export function* authenticate () {
    try {
        yield put(uiActions.startFetching());

        const response = yield apply(api, api.auth.authenticate);
        const { data: profile, message } = yield apply(response, response.json);

        if ( response.status !== 200 ) {
            if ( response.status === 401 ) {
                yield apply(localStorage, localStorage.removeItem, ['toke']);
                yield apply(localStorage, localStorage.removeItem, ['remember']);

                return null;
            }
            throw new Error(message);
        }
        yield apply(localStorage, localStorage.setItem, ['token', profile.token]); //после получения профайла логин пользователя

        yield put(profileActions.fillProfile(profile));
        yield put(authActions.authenticate());

    } catch (error) {
        yield put(uiActions.emitError(error, 'Authenticate worker'));
    } finally {
        yield put(uiActions.stopFetching());
        yield put(authActions.initialize());
    }
}
