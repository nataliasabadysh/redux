// Types
import { types } from './types';

export const postActions = {
    fillPost: (posts) => ({
        type:    types.FILL_POST,
        payload: posts, // привязываем данные о постах

    }),
    createPost: (posts) => ({
        type:    types.CREATE_POST,
        payload: posts, //  данные о посте
    }),

    fetchPostAsync: () => ({
        type: types.FETCH_POST_ASYNC,
    }),

    createPostAsync: (comment) => ({
        type:    types.CREATE_POST_ASYNC,
        payload: comment, // доступ к тексту
    }),


};
