import React from 'react';
import Styled from 'styled-components';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { useRouteMatch, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';

import axios from '../axios-inst';
import Reactions from '../components/reaction';
import Image from '../components/image';
import Modal from '../components/modal';
import decorators from '../util/draft-util/decorators';
import myBlockRenderFn from '../util/draft-util/blockrender';
import Aux from '../hoc/aux';
import styles from '../themes/theme';

const Styles = Styled(Container)`
    .article-img {
        width: 100%;
        min-height: 275px;
    }

    .tag {
        background-color: ${styles.color1};
        color: white;
        height: auto;
        padding: 1px;
        border-radius: 2.5px;
    }

    .tagbox {
        width: 55%;
    }

    .info div {
        font-size: medium;
        font-weight: 400;
        align-self: flex-end;
    }

    .article-img img {
        height: 275px;
    }

    .article-body {
        height: 55%;
        width: 100%;
    }

    .share {
        width: 100%;
        height: 50px;
        margin: 10px 0;
    }

    .share div {
        border-radius: 3px;
        height: fit-content;
        padding: 0;
        margin: 0;
    }

    .share div a {
        text-decoration: none;
        color: white;
    }

    .share .wh {
        background-color: lawngreen;
        color: white;
        border: 1px solid lawngreen;
    }

    .share .fb, .share .tw {
        background-color: cornflowerblue;
        color: white;
        border: 1px solid cornflowerblue;
    }
`;

const Reducer = (state, action) => {
    switch (action.type) {
        case 'ERROR_OCCURRED':
            return {
                ...state,
                show: true,
                error: action.msg
            }
        case 'ERROR_SEEN':
            return {
                ...state,
                show: false
            }
        default: return state
    }
}

const Article = () => {
    let match = useRouteMatch();
    let location = useLocation();
    let url = match.url + location.search;
    let title = location.search.split('=')[1];
    let [ state, dispatch ] = React.useReducer(Reducer, { error: null, show: false });
    let [ post, setPost ] = React.useState({ title: '', img: '', tags: [], writer: '', edited: false, postedOn: Date.now()});
    let [ loading, setLoading ] = React.useState(true);
    let [ reaction, setReaction ] = React.useState({ upvote: 0, downvote: 0, voters: [] });
    let [ editorState, setEditorState ] = React.useState(() => EditorState.createEmpty(decorators));

    React.useEffect(() => {
        let isMounted = true;
        let initArticle = async () => {
            try {
                if(isMounted) {
                    let response = await axios.get(url);
                    let contentState = convertFromRaw(JSON.parse(response.data.post.content));
                    setLoading(false);
                    setPost({ title: response.data.post.title, img: response.data.post.imgUrl,
                        tags: response.data.post.tags, writer: response.data.post.writerId.username,
                        edited: response.data.post.edited, 
                        postedOn: new Date(response.data.post.postedOn).toLocaleDateString() 
                    });
                    setEditorState(() => EditorState.createWithContent(contentState, decorators));
                    setReaction({ upvote: response.data.post.upvotes, downvote: response.data.post.downvotes,
                        voters: response.data.post.sponsors
                    });
                }
            } catch(e) {
                if(isMounted) {
                    setLoading(false);
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

        initArticle();

        return () => {
            isMounted = false;
        }
    }, [url]);

    let closeModal = () => dispatch({type: 'ERROR_SEEN'});

    let onVote = async (type) => {
        try {
            let data = { type: type };
            let token = localStorage.getItem('token');
            let response = await axios.post(match.url + location.search, data, { headers: { "Authorization": token } });
            
            //* setting the reaction data 
            setReaction({ upvote: response.data.post.upvotes, downvote: response.data.post.downvotes,
                voters: response.data.post.sponsors
            });
        } catch(e) {
            setLoading(false);
            if(e.response) {
                dispatch({type: "ERROR_OCCURRED", msg: e.response.data.error || "Network Error"});
            } else if(e.request) {
                dispatch({type: "ERROR_OCCURRED", msg: e.request.data.error || "Network Error"});
            }else {
                dispatch({type: "ERROR_OCCURRED", msg: e.message || "Network Error"});
            }
        }
    }

    return (
        <Styles fluid>
            <Row>
                <Col md={3}></Col>
                <Col sm={12} md={6}>
                    <div className="article-img mb-4">
                        <Image src={post.img}/>
                    </div>
                    <div className="article-body mt-4">
                        { loading ?
                            <div className="d-flex justify-content-center align-items-center">
                                <Spinner animation="border"/> 
                            </div> 
                            :
                            <Aux>
                                <h4 className="text-center">{post.title}</h4>
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex flex-wrap mb-4 tagbox">
                                        { post.tags.map((tag, i) => (
                                            <div key={i} className="tag mr-2 mb-2">
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="info mb-4 d-flex flex-column align-items-center">
                                        <div>By {post.writer}</div>
                                        <div>{post.postedOn}</div>
                                    </div>
                                </div>
                                <Editor
                                readOnly={true}
                                editorState={editorState}
                                blockRendererFn={myBlockRenderFn}/>
                                <div className="d-flex mt-5 mb-2">
                                    <Reactions reaction={reaction} vote={onVote}/>
                                </div>
                                <div className="d-flex justify-content-center mt-2 mb-2">Share</div>
                                <div className="share d-flex justify-content-around">
                                    <div className="fb">
                                        <a href={`https://www.facebook.com/sharer/sharer.php?u=https://coins4exp.com${url}`}>
                                            <FontAwesomeIcon icon={faFacebook} size="2x"/>
                                        </a>
                                    </div>
                                    <div className="wh">
                                        <a href={`https://wa.me/?text=${title}https://coins4exp.com${url}`}>
                                            <FontAwesomeIcon icon={faWhatsapp} size="2x"/>
                                        </a>
                                    </div>
                                    <div className="tw">
                                        <a href={`https://twitter.com/intent/tweet?text=${title}https://coins4exp.com${url}`}>
                                            <FontAwesomeIcon icon={faTwitter} size="2x"/>
                                        </a>
                                    </div>
                                </div>
                                <Modal title="Notification" close={closeModal} show={state.show}>
                                    <div className="d-flex justify-content-evenly">{state.error}</div>
                                </Modal>
                            </Aux>
                        }
                    </div>
                </Col>
                <Col md={3}></Col>
            </Row>
        </Styles>
    );
}

export default Article;