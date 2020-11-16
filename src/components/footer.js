import React from 'react';
import Styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { faInfoCircle, faShareSquare, faNewspaper, faArchive, faUserPlus, faDatabase, faSignInAlt, 
    faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Modal from "./modal";
import Subscription from "./subscription";
import LogIn from '../containers/login';
import styles from '../themes/theme';
import Aux from '../hoc/aux';
import { status } from '../store/atoms';

const Styles = Styled.footer`
    background-color: ${styles.aux};
    color: ${styles.color0};
    height: auto;
    line-height: 25px;
    width: 100%;
    margin: auto;
    z-index: 2000;

    .opt-icon {
        &:hover {
            cursor: pointer;
        }
    }
`;

const Footer = props => {
    let [ auth, setAuth ] = useRecoilState(status);
    let [ subShow, setSubShow ] = React.useState(false);
    let [ authShow, setAuthShow ] = React.useState(false);

    let aboutHandler = () => props.history.push('/faq');

    let myPostsHandler = () => props.history.push('/myposts');

    let postsHandler = () => props.history.push('/posts');

    let toggleSubModal = () => setSubShow(!subShow);

    let toggleAuthModal = () => setAuthShow(!authShow);

    let signOutHandler = () => {
        setAuth({isLoggedIn: false, writerId: 0});
        localStorage.removeItem('token');
        localStorage.removeItem('expires');
        props.history.push('/');
    }

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
            <div className="d-flex flex-column align-items-center opt-icon" onClick={postsHandler}>
                <FontAwesomeIcon icon={faDatabase}/>
                <small>Posts</small>
            </div>
            { auth.isLoggedIn ?
                <Aux>
                    <div className="d-flex flex-column align-items-center opt-icon" onClick={myPostsHandler}>
                        <FontAwesomeIcon icon={faArchive}/>
                        <small>My Posts</small>
                    </div> 
                    <div className="d-flex flex-column align-items-center opt-icon" onClick={signOutHandler}>
                        <FontAwesomeIcon icon={faSignOutAlt}/>
                        <small>Sign Out</small>
                    </div>
                </Aux>
                :
                <Aux>
                    <div className="d-flex flex-column align-items-center opt-icon" onClick={toggleAuthModal}>
                        <FontAwesomeIcon icon={faUserPlus}/>
                        <small>Join</small>
                    </div>
                    <div className="d-flex flex-column align-items-center opt-icon" onClick={toggleAuthModal}>
                        <FontAwesomeIcon icon={faSignInAlt}/>
                        <small>Sign In</small>
                    </div>
                </Aux>
            }            
            <div className="d-flex flex-column align-items-center opt-icon" onClick={aboutHandler}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                <small>FAQ</small>
            </div>
            <Modal show={subShow} isForm={true} close={toggleSubModal} title="Subcribe To Our Newsletter">
                <Subscription close={toggleSubModal}/>
            </Modal>
            <Modal show={authShow} isForm={true} close={toggleAuthModal} title="Sign In">
                <LogIn close={toggleAuthModal}/>
            </Modal>
        </Styles> 
    ); 
};

export default withRouter(Footer);
