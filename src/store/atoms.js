import { atom } from 'recoil';

const status = atom({
    key: 'writer',
    default: {isLoggedIn: false, writerId: 1}
});

export default status;