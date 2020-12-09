import React from 'react';
import Styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Spinner from 'react-bootstrap/Spinner';

import axios from '../axios-inst';
import errorHandler from '../hoc/errorhandler';
import status from '../store/atoms';

const Styles = Styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Reducer = (state, action) => {
    switch(action.type) {
        case 'FETCHING_AUTH_STATUS':
            return {
                ...state,
                loading: true
            }
        case 'FETCHED_AUTH_STATUS':
            return {
                ...state,
                loading: false,
                redirect: true,
                url: action.url
            }
        case 'ERROR_OCCURRED':
            return {
                ...state,
                loading: false
            }
        default: return state
    }
}

const ThirdPartyAuth = () => {
    let setStatus = useSetRecoilState(status);
    let [ state, dispatch ] = React.useReducer(Reducer, { redirect: false, loading: true, url: ''});

    React.useEffect(() => {
        let Id;
        let fetchAuth = async () => {
            try {
                let response = await axios.get('/getAuth');
                let expirationTime = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                let timeLimit = response.data.expiresIn;
                localStorage.setItem('token', response.data.jwt);
                localStorage.setItem('expires', expirationTime);
                localStorage.setItem('id', response.data.id);
                Id = response.data.id;
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('expires');
                }, timeLimit * 1000);
                dispatch({ type: 'FETCHED_AUTH_STATUS', url: response.data.from });
            } catch(e) {
                dispatch({ type: 'ERROR_OCCURRED' });
            }
        }

        fetchAuth();

        return () => {
            setStatus({isLoggedIn: true, writerId: Id});
        }
    }, [setStatus]);

    return (
        <Styles>
            { state.loading ? <Spinner animation="border"/> : null}
            { state.redirect ? <Redirect to={state.url}/> : null }
        </Styles>
    );
}

export default errorHandler(ThirdPartyAuth, axios);