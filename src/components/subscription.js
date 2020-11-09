import React from 'react';
import Styled from 'styled-components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import Button from './button';
import styles from '../themes/theme';

const Styling = Styled(Container)`
    .sub {
        width: 100%;
        height: 40px;
        color: ${styles.color1};
    }    

    .sub .grp {
        height: 100%;
    }

    .sub .grp .form-control {
        height: 100%;
    }

    .sub button {
        height: 100%;
    }

    .form-text {
        color: red;
    }
`;

const Subscription = props =>  {

    let validationSchema = Yup.object().shape({
        email: Yup.string().email().required()
    });
    
    let component = ({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
        <Styling fluid>
            <Form className="sub d-flex justify-content-center align-items-center mb-2" onSubmit={handleSubmit}>
                <Form.Group className="grp mb-0 mr-2">
                    <Form.Control name="email" type="email" placeholder="Enter your email" 
                        onBlur={handleBlur} onChange={handleChange} value={values.email}/>
                    {errors.email && touched.email ? <Form.Text>{errors.email}</Form.Text> : null }
                </Form.Group>
                <Button type="submit" text="Submit"/>
            </Form>
        </Styling>
    );

    let submitHandler = (values, actions) => {
        console.log(values.email);
        actions.resetForm();
        props.close();
    }
    
    return ( <Formik initialValues={{ email: '' }} component={component} validationSchema={validationSchema} 
    onSubmit={submitHandler}/> );
};

export default Subscription;