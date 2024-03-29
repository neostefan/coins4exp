const checkAuthStatus = () => {
    let token = localStorage.getItem('token');
    let expirationDate = new Date(localStorage.getItem('expires'));

    if(expirationDate > new Date()) {
        if(token === null) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

export default checkAuthStatus