import React from 'react';
import Styled from 'styled-components';

const Styles = Styled.div`
    margin-bottom: 220px;
`

const Layout = props => (
    <Styles>
        { props.children }
    </Styles>
);

export default Layout;