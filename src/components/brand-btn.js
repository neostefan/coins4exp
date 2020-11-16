import React from 'react';
import Styled from 'styled-components';

import styles from '../themes/theme';

const Button = Styled.button`
    background-color: "#fefefe";
    color: ${styles.color1};
    display: flex;
    justify-content: space-around;
    width: 200px;
    height: 35px;
    padding: 4px;
    border: 1px solid ${styles.color0};
    border-radius: 7px;
    box-shadow: 2px 1px .5px 1px #0ffefe;
    margin: auto;

    .br-icon {
        width: 100%
        height: 100%;
    }
`;

const brandButton = props => (
    <Button onClick={props.click} type={props.type}>
        <div className="br-icon">
            { props.children }
        </div>
        { props.text }
    </Button>
);

export default brandButton;
