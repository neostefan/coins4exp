import React from 'react';
import Styled from 'styled-components';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import axios from '../axios-inst';
import Reactions from '../components/reaction';
import Image from '../components/image';
import decorators from '../util/draft-util/decorators';
import myBlockRenderFn from '../util/draft-util/blockrender';
import errorHandler from '../hoc/errorhandler';
import Aux from '../hoc/aux';

const Styles = Styled(Container)`
    .article-img {
        width: 100%;
        min-height: 275px;
    }

    .article-img img {
        height: 275px;
    }

    .article-body {
        height: 55%;
        width: 100%;
    }
`;

const Article = props => {

    let [ post, setPost ] = React.useState({ title: '', img: ''});
    let [ loading, setLoading ] = React.useState(true);
    let [ reaction, setReaction ] = React.useState({ upvote: 0, downvote: 0, voters: [] });
    let [ editorState, setEditorState ] = React.useState(() => EditorState.createEmpty(decorators));

    React.useEffect(() => {
        let initArticle = async () => {
            try {
                let response = await axios.get(props.match.url + props.location.search);
                let contentState = convertFromRaw(JSON.parse(response.data.post.content));
                setLoading(false);
                setPost({ title: response.data.post.title, img: response.data.post.imgUrl });
                setEditorState(() => EditorState.createWithContent(contentState, decorators));
                setReaction({ upvote: response.data.post.upvotes, downvote: response.data.post.downvotes,
                    voters: response.data.post.sponsors
                });
            } catch(e) {
                
            }
        }

        initArticle();
    }, [props.match.url, props.location.search]);

    let onVote = async (type) => {
        try {
            let data = { type: type };
            let token = localStorage.getItem('token');
            let response = axios.post(props.match.url + props.location.search, data, { headers: { "Authorization": token } });
            //! check what type of response i am sending back and update the reactions appropriately
            console.log(response.data);
        } catch(e) {

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
                                {/* need to write author's name as well as if it was edited */}
                                <Editor
                                readOnly={true}
                                editorState={editorState}
                                blockRendererFn={myBlockRenderFn}/>
                                <div className="d-flex mt-4 mb-2">
                                    <Reactions reaction={reaction} vote={onVote}/>
                                </div>
                            </Aux>
                        }
                    </div>
                </Col>
                <Col md={3}></Col>
            </Row>
        </Styles>
    );
}

export default errorHandler(Article, axios);