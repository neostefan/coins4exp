import React from 'react';
import Styled from 'styled-components';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';

import img from '../assets/biz2.2.jpg';
import styles from '../themes/theme';

//* altered z-index overlay from -1 to 4 and jumbo -2 to 2
const Styles = Styled.div`
    .jumbo {
        height: 800px;
        position: relative;
        z-index: 2;
        padding: 0;
        top: 0;
        left: 0;
    }

    .base-img {
        width: 100%;
        height: 800px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }

    .navbar-brand {
        color: ${styles.color0};
        &:hover {
            color: ${styles.color1}
        }
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.5;
        background-color: black;
        color: white;
        z-index: 4;
        width: 100%;
    }

    .textbox {
        position: absolute;
        top: 150px;
        right: 20px;
        width: 200px;
        height: 350px;
        color: ${styles.color0};
        line-height: 30px;
        font-size: large;
        font-weight: 300;
    }

    @media(max-width: 500px) {
        .textbox {
            top: 125px;
            right: 5px;
            width: 150px;
        }
    }

`

const Background = () => (
   <Styles>
       <Jumbotron className="jumbo" fluid>
            <Navbar className="d-flex justify-content-end">
                <Navbar.Brand as={Link} to="/">Coin Cryptid</Navbar.Brand>
            </Navbar>
            <div className="d-flex textbox">
                Share your experiences and earn cryptocurrency tokens
            </div>
            <img className="base-img" src={img} alt="base"/>
       </Jumbotron>
   </Styles>
)

export default Background;