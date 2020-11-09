import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import Article from './article';
import Posts from './posts';
import PostEditor from './post_editor';
import Dashboard from './dashboard';
import About from '../containers/about';
import * as Atoms from '../store/atoms';
import checkAuthStatus from '../util/auth-util';

const Routes = props => {
    
    let [status, setStatus] = useRecoilState(Atoms.status);

    useEffect(() => {
        //todo use a selector to handle this instead
        let value = checkAuthStatus();
        if(value === true) {
            let id = localStorage.getItem('id');
            setStatus({isLoggedIn: value, writerId: id});
        } else {
            setStatus({isLoggedIn: value, writerId: 1});
        }
    }, [setStatus, props]);

    if(status.isLoggedIn) {
        return (
            <Switch>
                <Route path="/posts" component={Posts}/>
                <Route path="/add" component={PostEditor}/>
                <Route path="/edit" component={PostEditor}/>
                <Route path="/myposts" component={Posts}/>
                <Route path="/post" component={Article}/>
                <Route path="/faq" component={About}/>
                <Route path="/" component={Dashboard}/>
            </Switch>
        )
    } else {
        return (
            <Switch>
                <Route path="/post" component={Article}/>
                <Route path="/posts" component={Posts}/>
                <Route path="/faq" component={About}/>
                <Route path="/" component={Posts}/>
            </Switch>
        );
    }
}

export default Routes;