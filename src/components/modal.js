import React from 'react';
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';

import Button from './button';
import styles from '../themes/theme';

const Styled = styled(Modal)`
    .modal-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        color: ${styles.color1};
    }

    .modal-header {
        color: ${styles.color1};
    }
`

const customModal = props =>  (
    <Styled show={props.show} onHide={props.close}>
        <Modal.Header closeButton>
            { props.title }
        </Modal.Header>
        <Modal.Body>
            { props.children }
        </Modal.Body>
        { props.isForm ? null : 
            <Modal.Footer>
                <Button click={props.close} type="submit" text="Okay"/>
            </Modal.Footer>
        }
    </Styled>
);

export default React.memo(customModal);