import React from 'react';
import styled from 'styled-components';

import Image from '../../components/image';

const Upload = styled.div`
    width: 100%;
    height: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    img {
        width: 100%;
        height: 300px;
    }

    video {
        width: 100%;
        height: 300px;
    }

    div {
        width: 100%;
    }
`;

const mediaComponent = props => {
    const { contentState } = props;
    const entity = contentState.getEntity(props.block.getEntityAt(0));
    const { src } = entity.getData();
    const type = entity.getType();

    if(type === 'image') {
        return (
            <Upload>
                <Image src={src}/>
                <div>image credits: {src}</div>
            </Upload>
        )
    }

    if(type === 'video') {
        return (
            <Upload>
                <video src={src}/>
                <div>video credits: {src}</div>
            </Upload>
        );
    }
}

export default mediaComponent;