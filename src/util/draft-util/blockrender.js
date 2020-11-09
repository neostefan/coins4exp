import mediaComponent from './draft-component';

const myBlockRenderFn = contentBlock => {
    const type = contentBlock.getType();
    
    if(type === 'atomic') {
        return {
            component: mediaComponent,
            editable: false
        }
    }

    return null;
}

export default myBlockRenderFn;