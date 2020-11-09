import React from 'react';
import { Formik } from 'formik';
import { useSetRecoilState } from 'recoil';
import Styled from 'styled-components';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '../components/button';
import Brbutton from '../components/brand_btn';
import styles from '../themes/theme';
import axios from '../axios-auth';
import { status } from '../store/atoms';

const Styling = Styled(Container)`
    .card {
        border: none;
        color: ${styles.color1};
    }

    .form-control {
        border-color: ${styles.color0};
        &:focus {
            border-color: ${styles.color1};
            box-shadow: 0 0 0 .1rem ${styles.color0};
        }
    }

    .spinner-grow {
        color: ${styles.color1};
    }

    .signupbtn {
        margin-top: 7px;
        display: block;
        margin-right: auto;
        margin-left: auto;
        width: 50%;
    }

    .form-text {
        color: red;
    }

    .switch {
        &:hover {
            cursor: pointer;
            text-decoration: underline;
        }
    }
`;

const Reducer = (state, action) => {
    switch(action.type) {
        case 'REQUESTING_DATA':
            return {
                ...state,
                loading: true
            }
        case 'ERROR_FOUND':
            return {
                ...state,
                err: action.err,
                show: true,
                loading: false
            }
        case 'MSG_FOUND':
            return {
                ...state,
                msg: action.msg,
                show: true,
                loading: false
            }
        case 'ALERT_SEEN':
            return {
                ...state,
                msg: null,
                show: false,
                err: null
            }
        default: return state;
    }
};

const LogIn = props => {
    let [ state, dispatch ] = React.useReducer(Reducer, { err: null, loading: false, msg: null, show: false });
    let setStatus = useSetRecoilState(status);

    let validationSchema = Yup.object().shape({
        email: Yup.string().required().trim().email(),
        password: Yup.string().required().trim().matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})', 'min of 8 characters and mix of numbers and upper and lowercase letters')
    });

    let googleHandler = () => {
        console.log(props);
    }

    let submitHandler = async (values, actions) => {
        try {
            dispatch({type: 'REQUESTING_DATA'});
            let response = await axios.post('/login', values);
            let expirationTime = new Date(new Date().getTime() + response.data.expiresIn * 1000);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('expires', expirationTime);
            localStorage.setItem('id', response.data.writer);
            setStatus({isLoggedIn: true, writerId: response.data.writer});
            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('expires');
            }, response.data.expiresIn * 1000);
            props.close();
        } catch (e) {
            if(e.response) {
                dispatch({type: 'ERROR_FOUND', err: e.response.data.error});
            } else if(e.request) {
                dispatch({type: 'ERROR_FOUND', err: e.request.data.error});
            } else {
                dispatch({type: 'ERROR_FOUND', err: 'Network Error'});
            }
        }
    }

    let component = ({handleChange, handleSubmit, errors, values, handleBlur, touched}) => (
        <Styling fluid>
            <Row>
                <Col md={12}>
                    { state.err ? 
                        <Alert variant="danger" show={state.show} onClose={() => dispatch({type: 'ALERT_SEEN'})} dismissible>
                            {state.err}
                        </Alert>
                        : null
                    }
                    { state.msg ? 
                        <Alert variant="success" show={state.show} onClose={() => dispatch({type: 'ALERT_SEEN'})} dismissible>
                            {state.msg}
                        </Alert>
                        : null
                    }
                    <Card>
                        { state.loading ? 
                        <div className="d-flex justify-content-center">
                            <Spinner animation="grow"/>
                        </div> : 
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                    placeholder="Enter your email address"
                                    type="email"
                                    name="email"
                                    onBlur={handleBlur}
                                    onChange={handleChange('email')}
                                    value={values.email}/>
                                    { errors.email && touched.email ? <Form.Text>{errors.email}</Form.Text> : null }
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                    placeholder="Create a password"
                                    name="password"
                                    type="password"
                                    onChange={handleChange('password')}
                                    onBlur={handleBlur}
                                    value={values.password}/>
                                    {errors.password && touched.password ? <Form.Text>{errors.password}</Form.Text> : null }
                                </Form.Group>
                                <Brbutton className="signupbtn" type="button" text="Sign In With Google" click={googleHandler}>
                                    <FontAwesomeIcon icon={faGoogle}/>
                                </Brbutton>
                                <div className="d-flex justify-content-center switch mt-2 mb-2" onClick={() => props.history.push('/forgot-password')}>
                                    Forgot Password
                                </div>
                                <Button className="signupbtn" type="submit" text='Log In'/>
                            </Form>
                        </Card.Body>
                        }
                    </Card>
                </Col>
            </Row>
        </Styling>
    );

    return (
        <Formik 
        initialValues={{email: "", username: ""}} 
        component={component}
        onSubmit={submitHandler}
        validationSchema={validationSchema}/>        
    );
}

export default LogIn;