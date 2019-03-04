//Types
import { types } from './types';

//Instruments

export const postsActions = {

    // Sync
    fillPosts: (posts) => ({
            type:    types.FILL_POSTS,
            payload: posts,
    }),

    createPost: (post) => ({
        type:    types.CREATE_POSTS,
        payload: post,
    }),

    clearPost: () => ({
        type:    types.CLEAR_POSTS,
    }), 

    removePost: (id)=> ({
        type:    types.DELETE_POST,
        payload: id,
    }),

    // Async
    fetchPostsAsync: () => ({
        type: types.FETCH_POSTS_ASYNC,
    }),

    createPostAsync: (comment) => ({
        type:    types.CREATE_POST_ASYNC,
        payload: comment,
    }),

    removePostAsync: (id) =>({
        type:    types.DELETE_POST_ASYNC,
        payload: id,
    })
};
