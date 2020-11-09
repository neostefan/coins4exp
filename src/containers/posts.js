import React, { useEffect, useState } from 'react';
import Chunk from 'lodash.chunk';
import { useRecoilState, useRecoilValue } from 'recoil';
import Styled from 'styled-components';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

import Modal from '../components/modal';
import Post from '../components/post';
import axios from '../axios-inst';
import errorHandler from '../hoc/errorhandler';
import * as Atom from '../store/atoms';

const Styles = Styled(Container)`

`
const Posts = props => {

    const [msg, setMsg] = useState('');
    const [show, setShow] = useState(false);
    const [posts, setPosts] = useRecoilState(Atom.posts);
    const status = useRecoilValue(Atom.status);

    useEffect(() => {
        console.log(props.match.url);
        const getPosts = async () => {
            try {
                let token = localStorage.getItem('token');
                let response = await axios.get(props.match.url, {headers: {"Authorization": token}});
                setPosts(response.data.posts);
            } catch (e) {
                
            }
        }

        getPosts();
    }, [setPosts, props.match.url]);

    const viewPostHandler = id => {
        props.history.push("/post?Id=" + id);
    }

    const editPostHandler = id => {
        props.history.push("/edit?Id=" + id);
    }

    const deletePostHandler = async (id) => {
        try {
            let token = localStorage.getItem('token');
            let response = await axios.delete('/delete?Id=' + id, {headers: {"Authorization": token}});
            setShow(true);
            setPosts(response.data.posts);
            setMsg(response.data.msg);
        } catch (e) {
            console.log(e);
        }
    }

    const toggleShow = () => {
        setShow(false);
    }

    let postsChunk = new Chunk(posts, 2);

    return (
        <Styles>
            <Modal title="Notification" show={show} close={toggleShow}>
                <div className="d-flex justify-content-center">{msg}</div>
            </Modal>
            { postsChunk.map((chunk, i) => (
                <Row key={i}>
                    {chunk.map(post => (
                        <Col xs={12} lg={6} key={post._id}>
                            <Post title={post.title} redirect={() => viewPostHandler(post._id)}
                            img={post.imgUrl} url={props.match.url} authorized={status.isLoggedIn}
                            edit={() => editPostHandler(post._id)} delete={() => deletePostHandler(post._id)}/>
                        </Col>
                    ))}
                </Row>
            ))}
        </Styles>
    );
};

export default errorHandler(Posts, axios);