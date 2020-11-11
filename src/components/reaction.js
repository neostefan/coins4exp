import React from 'react';
import Styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import Container from 'react-bootstrap/Container';
import Tooltip from 'react-bootstrap/Tooltip';
import Overlay from 'react-bootstrap/Overlay';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import axios from '../axios-inst';
import styles from '../themes/theme';
import Modal from './modal';
import LogIn from '../containers/login';
import { status } from '../store/atoms';
import errorHandler from '../hoc/errorhandler';

const Styles = Styled(Container)`
    .fa-thumbs-up {
        &:hover {
            cursor: pointer;
        }
    }

    .fa-thumbs-down {
        &:hover {
            cursor: pointer;
        }
    }

    .popover {
        max-width: none;
    }
`;

const Reducer = (state, action) => {
    switch(action.type) {
        case 'AUTHORIZED_VOTED':
            return {
                ...state,
                tooltip: true
            }
        case 'NOTAUTHORIZED_VOTING':
            return {
                ...state,
                show: true
            }
        case 'AUTHORIZED_VOTING':
            return {
                ...state,
                show: false
            }
        default: return state
    }
}

const Reactions = props => {

    let auth = useRecoilValue(status);
    let [state, dispatch] = React.useReducer(Reducer, { show: false, tooltip: false });
    let target = React.useRef(null);

    let toggleShow = () => dispatch({ type: 'AUTHORIZED_VOTING' });

    let voteHandler = (type) => {
        let sponsor = props.reaction.voters.find(sponsor => sponsor === auth.writerId);

        console.log(auth.writerId);
        console.log(sponsor);
        console.log(auth.isLoggedIn);

        // * checking if user is authorized
        if(auth.isLoggedIn) {
            // * checking if user has voted before
            if(sponsor) {
                //* update the state to show they have voted before
                dispatch({ type: 'AUTHORIZED_VOTED' });
            } else {
                //* call the vote function since they have not voted before
                props.vote(type);
            }
        } else {
            //* updating the state to prompt the user to login
            dispatch({ type: 'NOTAUTHORIZED_VOTING' });
        }
    }

    return (
        <Styles fluid>
            <div className="d-flex align-items-start justify-content-center" ref={target}>
                <div className="mr-4">
                    <FontAwesomeIcon
                        icon={faThumbsUp} 
                        color={styles.aux}
                        onClick={() => voteHandler('upvotes')}
                    /> { props.reaction.upvote }
                    <Overlay 
                        show={state.tooltip} 
                        placement="top" 
                        target={target.current}>
                        {(props) => (
                            <Tooltip id="overlay" {...props}>
                                Max vote 1
                            </Tooltip>
                        )}
                    </Overlay>
                </div>
                <div className="ml-4">
                    <FontAwesomeIcon
                        icon={faThumbsDown} 
                        color={styles.aux} 
                        flip="horizontal"
                        onClick={() => voteHandler('downvotes')}
                    /> { props.reaction.downvote }
                    <Overlay target={target.current} show={state.tooltip} placement="top">
                        {(props) => (
                            <Tooltip id="overlay" {...props}>
                                Max vote 1
                            </Tooltip>
                        )}
                    </Overlay>
                </div>
            </div>
            <Modal show={state.show} title="LogIn" isForm={true} close={toggleShow}>
                <LogIn close={toggleShow}/>
            </Modal>
        </Styles>
    );
}

export default errorHandler(Reactions, axios);