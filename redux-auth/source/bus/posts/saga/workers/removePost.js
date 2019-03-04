//Core
import { put, apply } from 'redux-saga/effects';

//Instruments
import { api } from '../../../../REST';
import { postsActions } from '../../actions';
import { uiActions } from '../../../ui/actions';

export function* removePost ({ payload: id }) {
    try {
        yield put(uiActions.startFetching());
        const response = yield apply(api, api.posts.remove, [id]);

        if (response.status !== 204) {
            const { message } = yield apply(response, response.json);

            throw new Error(message);
        }

        yield put(postsActions.removePost(id));

    } catch (error) {
        yield put(uiActions.emitError(error, '-> Remove post worker'));
    } finally {
        yield put(uiActions.stopFetching());
    }
}
