// Core
import { put, apply } from 'redux-saga/effects';
// Indtruments
import { api } from '../../../../REST';
import { postActions } from '../../actions';
import { uiAtions } from '../../../ui/actions';

export function* createPost ({ payload: comment }) {
    try {
        yield put(uiAtions.startFetching());

        const response =  yield apply(api, api.posts.create, [comment]);
        const { data: post, message } =    yield apply(response, response.json);

        if (response.status !== 200) {
            throw new Error(message);
        }
        yield put(postActions.createPost(post));
    } catch (error) {
        yield put(uiAtions.emitError(error, 'CreatePost worker'))

    } finally {
        yield put(uiAtions.stopFetching());
    }
}
