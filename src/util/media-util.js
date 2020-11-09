const checkType = (url, type, imageExec, videoExec, linkExec, state) => {
    if(type === 'image') {
        return imageExec(url, state);
    }

    if(type === 'video') {
        return videoExec(url, state);
    }

    if(type === 'link') {
        return linkExec(url, state);
    }
}

const checkTitle = type => {
    if(type === 'link') {
        return 'Enter Link URL'
    }

    if(type === 'image') {
        return 'Enter Image URL'
    }

    if(type === 'video') {
        return 'Enter Video URL'
    }
}

export {
    checkType,
    checkTitle
};