//Core
import { put, apply } from 'redux-saga/effects';
import { replace } from 'react-router-redux';

//Instruments
import { api } from '../../../../REST';
import { authActions } from '../../actions';
import { uiActions } from '../../../ui/actions';
import { profileActions } from '../../../profile/actions';
import { postsActions } from '../../../posts/actions';
import { book } from '../../../../navigation/book';

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
        // clean LS
        yield apply(localStorage, localStorage.removeItem, ['toke']);
        yield apply(localStorage, localStorage.removeItem, ['remember']);

        yield put(profileActions.clearProfile()); 
        yield put(postsActions.clearPost());     

        yield put(uiActions.stopFetching());
        yield put(authActions.logout());

        yield put(replace(book.login)); 


    }
}
