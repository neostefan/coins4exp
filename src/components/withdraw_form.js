import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';

import Button from './button';

const WithdrawalForm = props => {

    let [amount, setAmount] = useState(0);

    let handleChange = e => setAmount(e.target.value);

    let handleSubmit = e => {
        e.preventDefault();
        props.submit(amount);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control 
                placeholder="Enter amount to withdraw"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={handleChange}/>
            </Form.Group>
            <Button type="submit" text="withdraw"/>
        </Form> 
    )
}

export default WithdrawalForm;
