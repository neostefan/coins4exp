import React from 'react';
import { CompositeDecorator } from 'draft-js';

const styles = {
    center: {
        textAlign: 'center'
    },

    left: {
        textAlign: 'left'
    },

    right: {
        textAlign: 'right'
    }
}

const linkStrategy = (contentBlock, callback, contentState) => {

    //contentState is an ordered Map of contentBlock objects

    //contentBlock is an object that contains type and text property the type is the html tag being rendered
    //text is what is within the html tag
    contentBlock.findEntityRanges((char) => {
        //what we are doing is finding the range of text characters and getting each char key
        const entityKey = char.getEntity();

        return(
            entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK'
        );
    }, callback)
}

const alignStrategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(char => {
        const entityKey = char.getEntity();
        return (entityKey !== null && contentState.getEntity(entityKey).getType() === 'ALIGNMENT');
    }, callback);
}

const link = props => {
    const { contentState, entityKey } = props;
    const { url }  = contentState.getEntity(entityKey).getData();
    //props.children is our text we selected but it is shown as a draftjs object
    return (
        <a href={url}>
            {props.children}
        </a>
    )
}

const align = props => {
    const { contentState, entityKey } = props;
    const { type } = contentState.getEntity(entityKey).getData();

    if(entityKey === null) {
        return (
            <div>
                { props.children }
            </div>
        )
    }

    if(type === 'center') {
        return (
            <div style={{ textAlign: 'center' }}>
                { props.children }
            </div>
        )
    }

    if(type === 'left') {
        return (
            <div style={styles.left}>
                { props.children }
            </div>
        )
    }

    if(type === 'right') {
        return (
            <div style={styles.right}>
                { props.children }
            </div>
        )
    }
}

const decorators = new CompositeDecorator([
    {
        strategy: linkStrategy,
        component: link
    },

    {
        strategy: alignStrategy,
        component: align
    },
]);

export default decorators;