import React from 'react';
import Styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { NavLink, withRouter, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import Modal from './modal';
import SignUp from '../containers/signup';
import LogIn from '../containers/login';
import styles from '../themes/theme';
import { status } from '../store/atoms';

const Styling = Styled.div`
    .navbar {
        background-color: ${styles.background0};
        color: ${styles.color0};
    }

    .navbar-brand {
        color: ${styles.color0};
        &:hover {
            color: ${styles.color1}
        }
    }

    .navbar-light .navbar-nav  a.nav-link.active {
        color: ${styles.color1};
    }

    .navbar .nav-link {
        color: ${styles.color0};
        &:hover {
            text-decoration: none;
            color: ${styles.color1};
        }
    }

    .nav-link .btn {
        border: none;
        background-color: ${styles.background0};
        color: ${styles.color0};
        outline-color: ${styles.background0};
        outline-style: none;
        outline-width: 0;
        padding: 0;
    }
`;

const Navigation = props => {

    let [auth, setAuth] = useRecoilState(status);
    let [show, setShow] = React.useState({value: false, type: 'login'});//usememo

    //Consider the possibility of applying usecallback here
    let toggleShow = type => setShow(prevState => ({value: !prevState.value, type: type}));

    let onLogOut = () => {
        setAuth({isLoggedIn: false, writerId: 0});
        localStorage.removeItem('token');
        localStorage.removeItem('expires');
        props.history.push('/');
    }

    return (
        <Styling>
            <Navbar expand="md">
                <Navbar.Toggle aria-controls="basic-nav-ctrl"/>
                <Navbar.Brand as={Link} to="/">Coin Cryptid</Navbar.Brand>
                <Navbar.Collapse id="basic-nav-ctrl">
                    <Nav className="ml-auto">
                        { auth.isLoggedIn ? <Nav.Link as={NavLink} to="/add">Write</Nav.Link> : null }
                        { auth.isLoggedIn ? <Nav.Link as={NavLink} to="/d">Profile</Nav.Link> : null }
                        <Nav.Link as={NavLink} to="/posts">Posts</Nav.Link>
                        { auth.isLoggedIn ? 
                            <Nav.Link onClick={onLogOut}>LogOut</Nav.Link> : 
                            <Nav.Link onClick={() => toggleShow('login')}>LogIn</Nav.Link>
                        }
                        { auth.isLoggedIn ? null : <Nav.Link onClick={() => toggleShow('signup')}>SignUp</Nav.Link> }
                    </Nav>
                </Navbar.Collapse>
            </Navbar> 
            <Modal title="Authentication" show={show.value} close={() => toggleShow('login')} isForm={true}>
                { show.type === 'login' ?
                    <LogIn close={() => toggleShow('login')}/>
                    :
                    <SignUp close={() => toggleShow('signup')}/>
                }
            </Modal>
        </Styling>
    )
};

export default withRouter(Navigation);