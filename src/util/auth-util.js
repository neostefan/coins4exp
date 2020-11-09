const checkAuthStatus = () => {
    let token = localStorage.getItem('token');
    let expirationTime = localStorage.getItem('expires');
    let expirationDate = new Date(expirationTime);

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