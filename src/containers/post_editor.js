import React from 'react';
import Styled from 'styled-components';
import { Formik } from 'formik';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import {  faAlignLeft, faAlignRight, faLink, faImage, faVideo, faAlignCenter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import errorHandler from '../hoc/errorhandler';
import styles from '../themes/theme';
import axios from '../axios-inst';
import Modal from '../components/modal';
import MediaForm from '../components/media_form';
import TagsInput from '../components/tags_input';
import Decorators from '../util/draft-util/decorators';
import myBlockRenderFn from '../util/draft-util/blockrender';
import { checkType, checkTitle } from '../util/media-util';
import { inlineStyles, blockStyles } from '../util/draft-util/draft-styles';
import { toggleLink, toggleAlignment, toggleVideo, toggleImage } from '../util/draft-util/draft-functions'

const Styles = Styled(Container)`
    .card {
        color: black;
        min-height: 100px
    }

    .form-control {
        border: 1px solid ${styles.color1};
        &:focus {
            border-color: ${styles.color1};
            box-shadow: 0 0 0 .1rem ${styles.color1};
        }
    }

    .btn {
        background-color: ${styles.color1};
        border: 1px solid ${styles.color1};
        &:hover {
            color: ${styles.color1};
            background-color: ${styles.color0};
        }
    }

    .DraftEditor-root {
        height: 350px;
        border: 1px solid ${styles.color1};
        padding: 3px;
        overflow-y: auto;
        color: black;
    }

    .DraftEditor-editorContainer {
        height: 100%;
    }

    .public-DraftEditor-content {
        height: 100%;
    }

    .options-bar {
        background-color: ${styles.color0};
        border: 1px solid thistle;
    }

    .options .notactive {
        border: 1.5px solid ${styles.color0};
        height: 48px;
        border-radius: 4px;
        background-color: ${styles.color0};
        &:hover {
            border: 1.5px solid ${styles.color0};
            color: ${styles.color1};
        } 
    }

    .options .active {
        background-color: ${styles.color0};
        &:hover {
            color: ${styles.color1};
            background-color: ${styles.color0};
        }
    }

    .form-group .preview {
        height: 125px;
        width: 100%;
    }

    .form-group .preview span {
        display: block;
        text-align: center;
    }

    .form-group .preview img {
        height: 100px;
        width: 150px;
    }
`;

const Reducer = (state, action) => {
    switch(action.type) {
        case 'REQUESTING_DATA':
            return {
                ...state,
                loading: true
            }
        case 'GOT_RESPONSE':
            return {
                ...state,
                show: true,
                loading: false,
                msg: action.msg
            }
        case 'THUMBNAIL_UPLOAD':
            return {
                ...state,
                src: action.src,
                image: action.image
            }
        case 'ALERT_SEEN':
            return {
                ...state,
                show: false
            }
        default: return state;
    }
}

const PostEditor = props => {
    let [ state, dispatch ] = React.useReducer(Reducer, { show: false, msg: null, src: '', image: null, loading: false }); 
    let [ title, setTitle ] = React.useState('');
    let [ tags, setTags ] = React.useState([]);
    let [ editorState, setEditorState ] = React.useState(() => EditorState.createEmpty(Decorators));
    let [ mediaModal, setmediaModal ] = React.useState({show: false, type: 'image'});

    let validationSchema = Yup.object().shape({
        title: Yup.string().required().min(5)
    });

    let selectedTags = newTags => setTags(newTags);

    React.useEffect(() => {
        let getinitialValues = async () => {
            try {
                dispatch({type: 'REQUESTING_DATA'});
                let token = localStorage.getItem('token');
                let response = await axios.get(props.match.url + props.location.search, {headers: {"Authorization": token}});
                let contentState = convertFromRaw(JSON.parse(response.data.post.content));
                setTitle(response.data.post.title);
                setTags(response.data.post.tags);
                setEditorState(() => EditorState.createWithContent(contentState, Decorators));
                dispatch({type: 'GOT_RESPONSE', msg: null});
            } catch (e) { 

            }
        }

        if(props.match.url === '/edit') {
            getinitialValues();
        }
    }, [props.match.url, props.location.search]);

    let handleEditorState = state => setEditorState(state);
    
    let handleImage = e => {
        let index = e.currentTarget.files.length - 1;
        let file = e.currentTarget.files[index];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = e => { 
            console.log(e);
            dispatch({type: 'THUMBNAIL_UPLOAD', src: [reader.result], image: file}); 
        }
    }

    let toggleShow = (type) => setmediaModal({show: !mediaModal.show, type: type});

    let linkHandler = url => {
        let result = toggleLink(url, editorState);
        if(result.status !== null) {
            handleEditorState(result.editorState);
            setmediaModal({show: false, type: 'image'});
            return result.status
        }
        handleEditorState(result.editorState);
        setmediaModal({show: false, type: 'image'});  
    }

    let alignmentHandler = e => {
        let newEditorState = toggleAlignment(e, editorState);
        handleEditorState(newEditorState);
    }

    let videoHandler = url => {
        let newEditorState = toggleVideo(url, editorState);
        handleEditorState(newEditorState);
        setmediaModal({show: false, type: 'image'});
    }

    let imgHandler = url => {
        let newEditorState = toggleImage(url, editorState);
        handleEditorState(newEditorState);
        setmediaModal({show: false, type: 'image'});
    }

    let renderInlineStyleOptions = () => {
        let options = inlineStyles.map(inline => {    
            let style = editorState.getCurrentInlineStyle();
            let className = "notactive";

            if(style.has(inline.style)) {
                className = "active";
            }

            return (
                <Button
                key={inline.value}
                type="button"
                className={className}
                data-style={inline.style}
                onMouseDown={toggleInlineStyle}>
                    <FontAwesomeIcon icon={inline.value}/>
                </Button>
            );
        });

        return options;
    }

    let renderBlockTypeOptions = () => {
        let options = blockStyles.map(blockType => {
            let currentBlockType = RichUtils.getCurrentBlockType(editorState);
            let className = "notactive";
            if(currentBlockType === blockType.style) {
                className = "active";
            }

            return (
                <Button
                key={blockType.style}
                type="button"
                className={className}
                data-style={blockType.style}
                onMouseDown={toggleBlockStyle}>
                    <FontAwesomeIcon icon={blockType.value} flip={blockType.flip ? blockType.flip : null} 
                    size="sm"/>{ blockType.type ? blockType.type : null }
                </Button>
            );
        });

        return options;
    }

    let toggleInlineStyle = e => {
        e.preventDefault();
        const style = e.currentTarget.getAttribute('data-style');
        setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    }

    let toggleBlockStyle = e => {
        e.preventDefault();
        const style = e.currentTarget.getAttribute('data-style');
        setEditorState(RichUtils.toggleBlockType(editorState, style));
    }

    let handleKeyCmd = cmd => {
        const editorstate = RichUtils.handleKeyCommand(editorState, cmd);

        if(editorstate) {
            setEditorState(editorstate);
            return 'handled';
        }

        return 'not-handled';
    }

    const AddPostForm = ({ handleSubmit, handleChange, errors, handleBlur, values, touched }) => (
        <Styles fluid>
            <Row>
                <Col md={3}/>
                <Col xs={12} md={6}>
                    <Modal 
                    show={mediaModal.show} 
                    isForm={true}
                    close={() => toggleShow('image')}
                    title={checkTitle(mediaModal.type)}>
                        <MediaForm 
                        submit={(url) => checkType(url, mediaModal.type, imgHandler, videoHandler, linkHandler)}/>
                    </Modal>
                    <Card>
                        { state.msg ? 
                            <Alert variant="success" show={state.show} onClose={() => dispatch({type: 'ALERT_SEEN'})} dismissible>
                                {state.msg}
                            </Alert>
                            : null
                        }
                        { state.loading ?
                            <div className="d-flex justify-content-center align-items-center">
                                <Spinner animation="border" size="md"/>
                            </div> :  
                        <Card.Body>
                            <Form onSubmit={handleSubmit} onKeyPress={(e) => e.key === 'Enter' ? e.preventDefault() : null}>
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                    name="title"
                                    type="text" 
                                    onChange={handleChange('title')}
                                    onBlur={handleBlur}
                                    value={values.title}
                                    />
                                    {errors.title && touched.title ? <Form.Text>{errors.title}</Form.Text> : null}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Tags</Form.Label>
                                    <TagsInput selectedTags={selectedTags} tags={tags}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Post Thumbnail</Form.Label>
                                    <Form.File
                                    name="image" 
                                    type="file"
                                    onChange={handleImage}
                                    onBlur={handleBlur}
                                    />
                                    <Form.Text>
                                        thumbnail not required if editing
                                    </Form.Text>
                                    <div className="mt-2 mb-2 preview">
                                        <span>Preview</span>
                                        {
                                            state.src ?
                                            <div className="d-flex justify-content-center">
                                                <img src={state.src} alt={state.file}/>
                                            </div> : 
                                            null
                                        }
                                    </div>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Content</Form.Label>
                                    <div className="options-bar">
                                        <div className="options">
                                            { renderInlineStyleOptions() }
                                            { renderBlockTypeOptions() }
                                            <Button
                                            type='button'
                                            className="notactive"
                                            onMouseDown={() => toggleShow('link')}>
                                                <FontAwesomeIcon icon={faLink}/>
                                            </Button>
                                            <Button
                                            type='button'
                                            className="notactive"
                                            onMouseDown={() => toggleShow('image')}>
                                                <FontAwesomeIcon icon={faImage}/>
                                            </Button>
                                            <Button
                                            type='button'
                                            className="notactive"
                                            onMouseDown={() => toggleShow('video')}>
                                                <FontAwesomeIcon icon={faVideo}/>
                                            </Button>
                                            <Button
                                            className="notactive"
                                            type="button"
                                            data-style="left"
                                            onMouseDown={alignmentHandler}>
                                                <FontAwesomeIcon icon={faAlignLeft}/>
                                            </Button>
                                            <Button
                                            className="notactive"
                                            type="button"
                                            data-style="center"
                                            onMouseDown={alignmentHandler}>
                                                <FontAwesomeIcon icon={faAlignCenter}/>
                                            </Button>
                                            <Button
                                            className="notactive"
                                            type="button"
                                            data-style="right"
                                            onMouseDown={alignmentHandler}>
                                                <FontAwesomeIcon icon={faAlignRight}/>
                                            </Button>
                                        </div>
                                    </div>
                                    <Editor
                                    editorState={editorState}
                                    onChange={handleEditorState}
                                    handleKeyCommand={handleKeyCmd}
                                    blockRendererFn={myBlockRenderFn}/>
                                </Form.Group>
                                <Button type="submit">Post</Button>
                            </Form>
                        </Card.Body>
                        }
                    </Card>
                </Col>
                <Col md={3}/>
            </Row>
        </Styles>
    );

    return (
        <Formik enableReinitialize initialValues={{ title: title }} component={AddPostForm} 
        validationSchema={validationSchema} 
        onSubmit={ async (values, actions) => {
            console.log("submitting");
            try {
                let token = localStorage.getItem('token');
                let raw = convertToRaw(editorState.getCurrentContent());
                let content = JSON.stringify(raw);  
                let fd = new FormData();
                fd.append('title', values.title);
                fd.append('image', state.image);
                fd.append('tags', tags);
                fd.append('category', 'games');
                fd.append('content', content);
                dispatch({type: 'REQUESTING_DATA'});
                if(props.match.url === '/edit') {
                    let response = await axios.put(props.match.url + props.location.search, fd, {headers: {"Authorization": token}});
                    dispatch({type: 'GOT_RESPONSE', msg: response.data.msg});
                } else {
                    let response = await axios.post(props.match.url, fd, { headers: { "Authorization": token } });
                    dispatch({type: 'GOT_RESPONSE', msg: response.data.msg});
                }
                setEditorState(() => EditorState.createEmpty());
                setTitle('');
                setTags([]);
                dispatch({type: 'THUMBNAIL_UPLOAD', src: null, file: null});
                actions.resetForm();
            } catch(e) {

            }
        }}/>
    );
}

export default errorHandler(PostEditor, axios);
