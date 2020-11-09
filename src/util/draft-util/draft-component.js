import React from 'react';
import styled from 'styled-components';

const Image = styled.img`
    width: 75%;
    height: 250px;
    display: block;
    margin: 0 auto;
`;
const Video = styled.video`
    width: 75%;
    height: 250px;
    display: block;
    margin: 0 auto;
`;

const mediaComponent = props => {
    console.log(props);
    const { contentState } = props;
    const entity = contentState.getEntity(props.block.getEntityAt(0));
    const { src } = entity.getData();
    console.log(src);
    const type = entity.getType();
    console.log(type);

    if(type === 'image') {
        return (
            <Image alt="embed" src={src}/>
        )
    }

    if(type === 'video') {
        return (
            <Video src={src}/>
        );
    }
}

export default mediaComponent;