import React from 'react';
import Styled from 'styled-components';

import styles from '../themes/theme';

const Button = Styled.button`
    background-color: ${styles.color1};
    color: ${styles.color0};
    padding: 3px 5px;
    border: 1px solid ${styles.color1};
    border-radius: 5px;
    width: 85px;

    &:hover {
        background-color: ${styles.color0};
        color: ${styles.color1};
    }
`

const Cbutton = props => ( 
    <Button className={props.className} disabled={props.disable} onClick={props.click} type={props.type}>
        {props.text}
    </Button>
);

export default Cbutton;
