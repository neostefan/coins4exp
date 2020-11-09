import React from 'react';
import Styled from 'styled-components';
import Jumbotron from 'react-bootstrap/Jumbotron';
import img from '../assets/biz.jpg';

//altered z-index overlay from -1 to 4 and jumbo -2 to 2
const Styles = Styled.div`
    .jumbo {
        background: url(${img}) no-repeat fixed bottom;
        background-size: cover;
        height: 200px;
        position: relative;
        z-index: 2;
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
        left: 20px;
    }

`

const Background = () => (
   <Styles>
       <Jumbotron className="jumbo" fluid>
           <div className="overlay">
                <div className="textbox">
                    <h3>CoinExp</h3>
                </div>
           </div>
       </Jumbotron>
   </Styles>
)

export default Background;