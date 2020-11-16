import React from 'react';
import Chunk from 'lodash.chunk';
import { useRecoilValue } from 'recoil';
import Styled from 'styled-components';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import Modal from '../components/modal';
import Post from '../components/post';
import Pagination from '../components/pagination';
import axios from '../axios-inst';
import errorHandler from '../hoc/errorhandler';
import { status  } from '../store/atoms';

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
                loading: false
            }
        default: return state
    }
}

const Posts = props => {
    let [state, dispatch] = React.useReducer(Reducer, {msg: '', show: false, loading: true, posts: []});
    let [curr, setCurr] = React.useState(1);
    let auth = useRecoilValue(status);

    React.useEffect(() => {
        dispatch({type: 'FETCHING_POSTS'});
        let getPosts = async () => {
            try {
                let token = localStorage.getItem('token');
                let response = await axios.get(props.match.url, {headers: {"Authorization": token}});
                console.log(response.data.posts);
                dispatch({type: 'FETCHED_POSTS', posts: response.data.posts});
            } catch (e) {
                dispatch({type: 'ERROR_OCCURRED'});        
            }
        }

        getPosts();
    }, [props.match.url]);

    let viewPostHandler = id => props.history.push("/post?Id=" + id);

    let editPostHandler = id => props.history.push("/edit?Id=" + id);
    
    let deletePostHandler = async (id) => {
        dispatch({type: 'DELETING_POST'});
        try {
            let token = localStorage.getItem('token');
            let response = await axios.delete('/delete?Id=' + id, {headers: {"Authorization": token}});
            dispatch({type: 'DELETED_POST', msg: response.data.msg, posts: response.data.posts});
        } catch (e) {
            dispatch({type: 'ERROR_OCCURRED'});
        }
    }

    let toggleShow = () => dispatch({type: 'TOGGLE_MODAL'});

    let paginate = (page) => setCurr(page);
    
    console.log(state.posts.length);

    let lastPageIndex = curr * 4;
    let firstPageIndex = lastPageIndex - 4;
    let posts = state.posts.slice(firstPageIndex, lastPageIndex);

    let postsChunk = new Chunk(posts, 2);

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
                    <div className="d-flex justify-content-center">{state.msg}</div>
                </Modal>
                { postsChunk.map((chunk, i) => (
                    <Row key={i}>
                        {chunk.map(post => (
                            <Col xs={12} lg={6} key={post._id}>
                                <Post title={post.title} redirect={() => viewPostHandler(post._id)}
                                img={post.imgUrl} url={props.match.url} authorized={auth.isLoggedIn}
                                edit={() => editPostHandler(post._id)} delete={() => deletePostHandler(post._id)}/>
                            </Col>
                        ))}
                    </Row>
                ))}
                <Pagination totalPosts={state.posts.length} postsPerPage={4} 
                currentPage={curr} paginate={paginate}/>
            </Styles>
        );
    }
}

export default errorHandler(Posts, axios);