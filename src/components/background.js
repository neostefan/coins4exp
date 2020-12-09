import React from 'react';
import Styled from 'styled-components';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { Link, useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';

import img from '../assets/biz2.2.jpg';
import banner from '../assets/coins4expBanner.png';
import styles from '../themes/theme';
import Aux from '../hoc/aux';

//* altered z-index overlay from -1 to 4 and jumbo -2 to 2
const Styles = Styled.div`
    .jumbo {
        position: relative;
        z-index: 2;
        padding: 0;
        top: 0;
        left: 0;
        border-radius 0px;
    }

    .jumbo-nav {
        background-image: url(${img});
        background-size: cover;
        background-position: top left;
        height: 250px;
    }

    .jumbo-base {
        height: 800px;
    }

    .base-img {
        width: 100%;
        height: 100%;
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

    .textbox {
        position: absolute;
        top: 150px;
        right: 25px;
        width: 25%;
        height: 35%;
        color: ${styles.color0};
        line-height: 50px;
        font-size: xx-large;
        font-weight: 300;
        padding-right: 5px;
    }

    @media(max-width: 750px) {
        .textbox {
            padding-right: 5px;
            line-height: 30px;
            font-size: medium;
            top: 125px;
            right: 5px;
            width: 27%;
        }

        .jumbo-nav {
            height: 250px;
        }

        .jumbo-base {
            height: 500px;
        }
    }
`;

const Background = () => {
    let location = useLocation();
    return  (
        <Styles>
            { (location.pathname === "/") ? 
                <Jumbotron className="jumbo jumbo-base" fluid>
                    <Navbar className="d-flex justify-content-end">
                        <Navbar.Brand as={Link} to="/">
                            <img alt="logo" src={banner}/>
                        </Navbar.Brand>
                    </Navbar>
                    <Aux>
                        <div className="d-flex textbox">
                            Share your experiences and earn cryptocurrency tokens
                        </div>
                        <img className="base-img" src={img} alt="base"/> 
                    </Aux>
                </Jumbotron> :

                <Jumbotron className="jumbo jumbo-nav">
                        <Navbar className="d-flex justify-content-end">
                        <Navbar.Brand as={Link} to="/">
                            <img alt="logo" src={banner}/>
                        </Navbar.Brand>
                    </Navbar>
                </Jumbotron>
            }
        </Styles>
    );
}

export default Background;