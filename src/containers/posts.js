import React from 'react';
import Styled from 'styled-components';
import Chunk from 'lodash.chunk';
import { useRecoilValue } from 'recoil';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import Modal from '../components/modal';
import Post from '../components/post';
import Pagination from '../components/pagination';
import axios from '../axios-inst';
import status from '../store/atoms';
import Aux from '../hoc/aux';

const Styles = Styled(Container)`

`;

const Reducer = (state, action) => {
    switch (action.type) {
        case 'FETCHING_POSTS':
            return {
                ...state,
                loading: true
            }
        case 'FETCHED_POSTS':
            return {
                ...state,
                loading: false,
                posts: action.posts
            }
        case 'DELETING_POST':
            return {
                ...state,
                loading: true
            }
        case 'DELETED_POST':
            return {
                ...state,
                loading: false,
                posts: action.posts,
                msg: action.msg,
                show: true
            }
        case 'TOGGLE_MODAL':
            return {
                ...state,
                show: false
            }
        case 'ERROR_OCCURRED':
            return {
                ...state,
                loading: false,
                err: action.msg
            }
        default: return state
    }
}

const Posts = () => {
    let match = useRouteMatch();
    let history = useHistory();
    let location = useLocation();
    let [state, dispatch] = React.useReducer(Reducer, {msg: '', show: false, loading: true, posts: [], err: null});
    let [curr, setCurr] = React.useState(() => {
        if(!location.state) {
            return 1;
        }
        return location.state.page;
    });
    
    //because this is changing it renders again since we call check auth selector
    let auth = useRecoilValue(status);

    React.useEffect(() => {
        /*handle state updates where component is unmounted due to this being connected to global state
        with the isMounted check*/
       let isMounted = true;
        dispatch({type: 'FETCHING_POSTS'});
        let getPosts = async () => {
            try {
                let token = localStorage.getItem('token');
                let response = await axios.get(match.url, {headers: {"Authorization": token}});
                if(isMounted === true) {
                    dispatch({type: 'FETCHED_POSTS', posts: response.data.posts});
                }
            } catch (e) {
                if(isMounted === true) {
                    if(e.response) {
                        dispatch({type: "ERROR_OCCURRED", msg: e.response.data.error || "Network Error"});
                    } else if(e.request) {
                        dispatch({type: "ERROR_OCCURRED", msg: e.request.data.error || "Network Error"});
                    }else {
                        dispatch({type: "ERROR_OCCURRED", msg: e.message || "Network Error"});
                    }
                }
            }
        }

        getPosts();

        return () => {
            isMounted = false;
        }
    }, [match.url]);

    let viewPostHandler = id => history.push("/post?title=" + id);

    let editPostHandler = id => history.push("/edit?Id=" + id);
    
    let deletePostHandler = async (id) => {
        dispatch({type: 'DELETING_POST'});
        try {
            let token = localStorage.getItem('token');
            let response = await axios.delete('/delete?Id=' + id, {headers: {"Authorization": token}});
            dispatch({type: 'DELETED_POST', msg: response.data.msg, posts: response.data.posts});
        } catch (e) {
            if(e.response) {
                dispatch({type: "ERROR_OCCURRED", msg: e.response.data.error || "Network Error"});
            } else if(e.request) {
                dispatch({type: "ERROR_OCCURRED", msg: e.request.data.error || "Network Error"});
            }else {
                dispatch({type: "ERROR_OCCURRED", msg: e.message || "Network Error"});
            }
        }
    }

    let toggleShow = () => dispatch({type: 'TOGGLE_MODAL'});

    let paginate = (page) => {
        let newLocation = {
            pathname: location.pathname,
            state: {
                page
            }
        }; 
        setCurr(page);
        history.push(newLocation); 
    };

    let postsChunk = []; 
    let lastPageIndex = curr * 4;
    let firstPageIndex = lastPageIndex - 4;
    let posts = state.posts.slice(firstPageIndex, lastPageIndex);

    if(state.posts.length > 0) {
       postsChunk = new Chunk(posts, 2);
    }

    if(state.loading) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border"/>
            </div>
        );
    } else {
        return (
            <Styles>
                <Modal title="Notification" show={state.show} close={toggleShow}>
                    { (state.err === null) ? 
                        <div className="d-flex justify-content-center">{state.msg}</div> 
                        :
                        <div className="d-flex justify-content-center">{state.err}</div>
                    }
                </Modal>
                { (state.posts.length > 0) ?
                    <Aux>
                        { postsChunk.map((chunk, i) => (
                            <Row key={i}>
                                {chunk.map(post => (
                                    <Col xs={12} lg={6} key={post._id}>
                                        <Post title={post.title} redirect={() => viewPostHandler(post.title)}
                                        img={post.imgUrl} url={match.url} authorized={auth.isLoggedIn}
                                        author={post.writerId.username}
                                        edit={() => editPostHandler(post._id)} delete={() => deletePostHandler(post._id)}/>
                                    </Col>
                                ))}
                            </Row>
                        ))}
                        <Pagination totalPosts={state.posts.length} postsPerPage={4} 
                        currentPage={curr} paginate={paginate}/>
                    </Aux> 
                    :
                    <div className="text-center">No Posts Found!</div>
                }
            </Styles>
        );
    }
}

export default Posts;