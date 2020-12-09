import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import Article from './article';
import Posts from './posts';
import PostEditor from './post-editor';
import Dashboard from './dashboard';
import About from './about';
import Landing from './landing';
import ThirdPartyAuth from './third-party-auth';
import ForgotPassForm from './forgot-pass';
import UpdatePassForm from './update-pass';
import ProtectedRoute from '../components/protectedRoute';
import status from '../store/atoms';
import checkAuthStatus from '../util/auth-util';
const Routes = () => {
    let setAuth = useSetRecoilState(status);

    React.useEffect(() => {
        let isLoggedIn = checkAuthStatus();
        if(isLoggedIn === true) {
            let Id = localStorage.getItem('id');
            setAuth({isLoggedIn: isLoggedIn, writerId: Id});
        } else {
            setAuth({isLoggedIn: false, writerId: 1});
        }
    }, [setAuth]);

    return (
        <Switch>
            <ProtectedRoute path="/add" component={PostEditor}/>
            <ProtectedRoute path="/edit" component={PostEditor}/>
            <ProtectedRoute path="/myposts" component={Posts}/>
            <ProtectedRoute path="/d" component={Dashboard}/>
            <Route path="/post"><Article/></Route>
            <Route path="/posts"><Posts/></Route>
            <Route path="/faq"><About/></Route>
            <Route path="/auth"><ThirdPartyAuth/></Route>
            <Route path="/forgot-password"><ForgotPassForm/></Route>
            <Route path="/update-password/:token"><UpdatePassForm/></Route>
            <Route path="/"><Landing/></Route>
        </Switch>
    );
}

export default Routes;