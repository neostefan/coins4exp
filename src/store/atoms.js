import { atom } from 'recoil';

const posts = atom({
    key: 'posts',
    default: []
});

const status = atom({
    key: 'writer',
    default: {isLoggedIn: false, writerId: 1}
});

export {
    posts,
    status
}