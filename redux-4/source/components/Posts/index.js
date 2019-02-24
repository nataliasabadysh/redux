// Core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FlipMove from 'react-flip-move';

// Instruments
import Styles from './styles.m.css';
import { mockedProfile } from '../../instruments/mockedData';

// Components
import { Composer, Catcher, Post } from '../../components';

// Action
import { postActions } from '../../bus/posts/actions';

const mSTP = (state) => ({
    posts: state.posts,
});

const mDTP = (dispatch) => ({
    actions: bindActionCreators({
        fatchPostAsync:  postActions.fetchPostAsync,
        createPostAsync: postActions.createPostAsync,
    }, dispatch),
});

@connect(mSTP, mDTP)

export default class Posts extends Component {
    static defaultProps = {
        // State
        profile: mockedProfile,

    };
    componentDidMount () {
        const { actions } = this.props;

        console.log('this action: ', this.props);
        actions.fatchPostAsync(); // get list of post
    }

    render () {
        const { actions, posts, profile } = this.props;

        const postsJSX = posts.map((post) => { // list
            return (
                <Catcher key = { post.get('id') }>
                    <Post
                        actions = { actions }
                        author = { post.get('author') }
                        comment = { post.get('comment') }
                        created = { post.get('created') }
                        id = { post.get('id') }
                        likes = { post.get('likes') }
                        profile = { profile }
                    />
                </Catcher>
            );
        });

        return (
            <section className = { Styles.posts }>
                <Composer actions = { actions } profile = { profile } />
                <FlipMove>{postsJSX}</FlipMove>
            </section>
        );
    }
}
