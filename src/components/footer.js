import React from 'react';
import Styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { faInfoCircle, faShareSquare, faNewspaper, faArchive } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Modal from "./modal";
import Subscription from "./subscription";
import styles from '../themes/theme';
import { status } from '../store/atoms';

const Styles = Styled.footer`
    background-color: ${styles.aux};
    color: ${styles.color0};
    height: auto;
    line-height: 25px;
    width: 50%;
    margin: auto;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
    z-index: 2000;

    .opt-icon {
        &:hover {
            cursor: pointer;
        }
    }
`;

const Footer = props => {
    let auth = useRecoilValue(status);
    let [show, setShow] = React.useState(false);

    let aboutHandler = () => props.history.push('/faq');

    let myPostsHandler = () => props.history.push('/myposts');

    let toggleSubModal = () => setShow(!show);

    return (
        <Styles className="fixed-bottom d-flex justify-content-center justify-content-around p-2">
            { props.location.pathname === "/post" ?
                <div className="d-flex flex-column align-items-center opt-icon">
                    <FontAwesomeIcon icon={faShareSquare}/>
                    <small>Share</small>
                </div> : null
            }
            <div className="d-flex flex-column align-items-center opt-icon" onClick={toggleSubModal}>
                <FontAwesomeIcon icon={faNewspaper}/>
                <small>Subcribe</small>
            </div>
            { auth.isLoggedIn ?
                 <div className="d-flex flex-column align-items-center opt-icon" onClick={myPostsHandler}>
                    <FontAwesomeIcon icon={faArchive}/>
                    <small>My Posts</small>
                </div> :
                null
            }
            <div className="d-flex flex-column align-items-center opt-icon" onClick={aboutHandler}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                <small>FAQ</small>
            </div>
            <Modal show={show} isForm={true} close={toggleSubModal} title="Subcribe To Our Newsletter">
                <Subscription close={toggleSubModal}/>
            </Modal>
        </Styles> 
    ); 
};

export default withRouter(Footer);
