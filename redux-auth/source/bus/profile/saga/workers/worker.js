// Core
import { put, apply } from 'redux-saga/effects';
// Indtruments
import { api } from '../../../../REST';
import { uiAtions } from '../../../ui/actions';

export function* worker () {
    try {
        yield put(uiAtions.startFetching());

        const response =  yield apply( api, api.posts.fetch );

        const { data: posts, message } =    yield apply(response, response.json);

        if (response.status !== 200) {
            throw new Error(message);
        }
    } catch (error) {
        yield put(uiAtions.emitError(error, 'worker'))

    } finally {
        yield put(uiAtions.stopFetching());
    }
}
