import React from 'react';
import Styled from 'styled-components';

import Posts from './posts';

const Styling = Styled.div`
    .text {
        font-size: x-large;
        font-weight: 700;
    }
`;

const Landing = props => {
    return (
        <Styling>
            <div className="text d-flex justify-content-center">
                Top Rated Experiences
            </div>
            <Posts {...props}/>
        </Styling>
    );
}
export default Landing;