// Types
import { FETCH_POST_ASYNC, FILL_POST, CREATE_POST, CREATE_POST_ASYNC } from './types';

// Indtruments
import { api } from '../../REST';

// Sync
export const fillPost = (posts) => ({
    type:    FILL_POST,
    payload: posts, // привязываем данные о постах

});

export const createPost = (posts) => ({
    type:    CREATE_POST,
    payload: posts, //  данные о посте
});

// Async
export const fatchPostAsync = () => async (dispatch) => {
    dispatch({
        type: FETCH_POST_ASYNC,
    });

    const response = await api.posts.fetch();
    const result = await response.json();

    dispatch(fillPost(result.data));
};

export const createPostAsync = (comment) => async (dispatch) => {
    dispatch({
        type: CREATE_POST_ASYNC,
    });

    const response = await api.posts.create(comment);
    const result = await response.json();

    dispatch(createPost(result.data));
};
