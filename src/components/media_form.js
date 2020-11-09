import React from 'react';
import Form from 'react-bootstrap/Form';

import Button from './button';

const MediaForm = props => {

    let [ src, setSrc ] = React.useState('');

    let handleChange = e => setSrc(e.target.value);

    let handleSubmit = e => {
        e.preventDefault();
        props.submit(src);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>URL</Form.Label>
                <Form.Control type="url" onChange={handleChange} value={src} placeholder="Enter URL"/>
            </Form.Group>
            <Button type="submit" text="Submit"/>
        </Form>
    )
}

export default MediaForm;