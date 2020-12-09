import { AtomicBlockUtils, RichUtils, EditorState, Modifier } from 'draft-js';

const toggleLink = (url, editorState) => {
    const selection = editorState.getSelection();

    if(!url) {
        return {
            editorState: RichUtils.toggleLink(editorState, selection, null),
            status: 'handled'
        }
    }

    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity('LINK', 'MUTABLE', { url: url });
    const newEditorState = EditorState.push(editorState, contentWithEntity, 'apply-entity');
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    return {
        editorState: RichUtils.toggleLink(newEditorState, selection, entityKey),
        status: null
    }
}

const toggleAlignment = (e, editorState) => {
    const selection = editorState.getSelection();
    const alignType = e.currentTarget.getAttribute('data-style');
    const contentState = editorState.getCurrentContent();
    const contentWithEntity = contentState.createEntity('ALIGNMENT', 'MUTABLE', {type: alignType});
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    const newContentState = Modifier.applyEntity(contentState, selection, entityKey);
    const newEditorState = EditorState.set(editorState, { currentContent: newContentState });
    return newEditorState;
}

const toggleVideo = (url, editorState) => {
    const contentState = editorState.getCurrentContent();
    const contentWithEntity = contentState.createEntity('video', 'IMMUTABLE', {src: url});
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentWithEntity });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
}

const toggleImage = (url, editorState) => {
    const contentState = editorState.getCurrentContent();
    const contentWithEntity = contentState.createEntity('image', 'IMMUTABLE', {src: url});
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentWithEntity });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
}

export {
    toggleAlignment,
    toggleLink,
    toggleVideo,
    toggleImage
}