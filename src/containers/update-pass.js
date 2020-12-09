import React from 'react';
import Styled from 'styled-components';
import { useRouteMatch } from 'react-router-dom';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import * as Yup from 'yup';

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

    .form-text {
        color: red;
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
                msg: action.msg,
                loading: false,
                show: true
            }
        case 'ERROR_FOUND':
            return {
                ...state,
                err: action.msg,
                loading: false,
                show: true
            }
        case 'NOTIF_SEEN':
            return {
                ...state,
                loading: false,
                show: false
            }
        default: return state
    }
}

const UpdatePassForm = () => {
    let match = useRouteMatch();
    let [state, dispatch] = React.useReducer(Reducer, {loading: true, show: false, err: null, msg: null});

    React.useEffect(() => {
        let fetchStatus = async () => {
            try {
                let response  = await axios.get(match.url);
                dispatch({type: 'SUBMISSION_DONE', msg: response.data.msg});
            } catch(e) {
                if(e.response) {
                    dispatch({type: 'ERROR_FOUND', msg: e.response.data.error});
                } else if(e.request) {
                    dispatch({type: 'ERROR_FOUND', msg: e.request.data.error});
                } else {
                    dispatch({type: 'ERROR_FOUND', msg: 'Network error'});
                }
            }
        }

        fetchStatus();
    }, [match.url]);

    let validationSchema = Yup.object().shape({
        password: Yup.string().required().trim().matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})', 'min of 8 characters and mix of numbers and upper and lowercase letters')
    });

    let toggleModal = () => dispatch({type: 'NOTIF_SEEN'});

    let component = ({handleBlur, handleChange, handleSubmit, values, errors, touched}) => (
        <Styles>
            <Card>
                <Card.Title>New Password</Card.Title>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                placeholder="Enter a new password"
                                value={values.password}
                                name="password"
                                type="password"
                                onChange={handleChange("password")}
                                onBlur={handleBlur}
                            />
                            {errors.password && touched.password ? <Form.Text>{errors.password}</Form.Text> : null }
                        </Form.Group>
                        <Button text="Submit" type="submit"/>
                    </Form>
                </Card.Body>
            </Card>
        </Styles>
    )

    if(state.loading) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border"/>
            </div>
        )
    } else {
        return (
            <Aux>
                <Formik initialValues={{password: ""}} validationSchema={validationSchema} component={component} 
                onSubmit={async (values, action) => {
                    try {
                        let fd = new FormData();
                        fd.append('password', values.password);
                        let response = await axios.post(match.url, fd);
                        dispatch({type: 'SUBMISSION_DONE', msg: response.data.msg});
                        action.resetForm();
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
                <Modal show={state.show} title="Notification" isForm={true} close={toggleModal}>
                    {
                        (state.err !== null) ? 
                        <div style={{color: "red", fontSize: "large"}}>
                            { state.err }
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

export default UpdatePassForm;

