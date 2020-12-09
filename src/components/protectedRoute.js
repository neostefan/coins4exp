import React from 'react';
import { useRecoilValue } from 'recoil';
import { Redirect, Route } from 'react-router-dom';

import status from '../store/atoms';

const ProtectedRoute = ({component: Component, ...rest}) => {

    let auth = useRecoilValue(status);

    return (
        <Route {...rest} >
            { auth.isLoggedIn ? <Component/> : <Redirect to="/"/> }
        </Route>
    )
}

export default ProtectedRoute;