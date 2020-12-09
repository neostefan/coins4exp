import React from 'react';
import Styled from 'styled-components';

import Posts from './posts';

const Styling = Styled.div`
    margin: 10px 0;

    .text {
        font-size: x-large;
        font-weight: 700;
    }
`;

const Landing = () => {
    return (
        <Styling>
            <div className="text d-flex justify-content-center">
                Recent Experiences
            </div>
            <Posts/>
        </Styling>
    );
}
export default Landing;