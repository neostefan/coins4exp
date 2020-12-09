import React from 'react';
import Styled from 'styled-components';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'; 
import Spinner from 'react-bootstrap/Spinner';

import Button from '../components/button';
import Modal from '../components/modal';
import Aux from '../hoc/aux';
import axios from '../axios-inst';
import styles from '../themes/theme';


const Styles = Styled(Container)`
    display: flex;
    justify-content: center;

    .card {
        width: 80%;
    }

    .form-label{
        color: ${styles.color1};
    }

    .form-control {
        border: 1px solid ${styles.color1};
        &:focus {
            box-shadow: 0 0 0 0.2rem ${styles.color0};
        }
    }

    .card-title {
        color: ${styles.color1};
        display: block;
        margin: auto;
        padding: 10px;
    }
`;

const Reducer = (state, action) => {
    switch (action.type) {
        case 'MOUNTED':
            return {
                ...state,
                loading: false
            }
        case 'SUBMITTING_FORM':
            return {
                ...state,
                loading: true
            }
        case 'SUBMISSION_DONE':
            return {
                ...state,
                show: true,
                loading: false,
                msg: action.msg
            }
        case 'ERROR_FOUND':
            return {
                ...state,
                loading: false,
                show: true,
                error: action.msg
            }
        case 'NOTIF_VIEWED':
            return {
                ...state,
                error: null,
                show: false,
                loading: false,
                msg: null
            }
        default: return state;
    }
}

const ForgotPassForm = () => {
    let [state, dispatch] = React.useReducer(Reducer, { loading: true, error: null, msg: null, show: false });
    let toggleModal = () => dispatch({type: 'NOTIF_VIEWED'});

    React.useEffect(() => {
        dispatch({type: 'MOUNTED'});
    }, [])

    let component = ({ handleBlur, handleChange, values, handleSubmit }) => (
        <Styles>
            <Card>
                <Card.Title>Forgot Password</Card.Title>
                <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                            placeholder="Enter your registered email"
                            type="email"
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange("email")}
                            value={values.email}
                        />
                    </Form.Group>
                    <Button text="Submit" type="submit"/>
                </Form>
                </Card.Body>
            </Card>
        </Styles>
    )

    if(state.loading === true) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border"/>
            </div>
        )
    } else {
        return (
            <Aux>
                <Formik initialValues={{ email: "" }} component={component}
                onSubmit={async (values) => {
                    dispatch({type: 'SUBMITTING_FORM'});
                    try {
                        let fd = new FormData();
                        fd.append('email', values.email);
                        let response = await axios.post('/forgot-password', fd);
                        dispatch({type: 'SUBMISSION_DONE', msg: response.data.msg});
                    } catch(e) {
                        if(e.response) {
                            dispatch({type: 'ERROR_FOUND', msg: e.response.data.error || 'Network Error'});
                        } else if(e.request) {
                            dispatch({type: 'ERROR_FOUND', msg: e.request.data.error || 'Network Error'});
                        } else {
                            dispatch({type: 'ERROR_FOUND', msg: 'Network error'});
                        }
                    }
                }}/>
                <Modal show={state.show} close={toggleModal} title="Notification" isForm={true}>
                    {
                        state.error ?
                        <div style={{color: "red", fontSize: "large"}}>
                            { state.error }
                        </div> :
                        <div style={{color: "#9ace69", fontSize: "large"}}>
                            { state.msg }
                        </div>
                    }
                </Modal>
            </Aux>
        )
    }
}

export default ForgotPassForm;