import React from 'react';
import Styled from 'styled-components';
import Card from 'react-bootstrap/Card';

import Button from './button';
import Image from './image';
import styles from '../themes/theme';

const Styles = Styled.div`
    .card {
        width: 100%;
        height: 180px;
        box-shadow: 4px 4px 2px ${styles.light};
        &:hover {
            cursor: pointer;
        }
    }

    .card .card-img {
        height: 100%;
        width: 50%;
        margin: auto;
        padding: 1px;
        background-color: ${styles.light};
    }

    .card .card-body {
        text-align: center;
        padding: 8px 3px;
        width: 100%;
    }
`;

//todo adding tags inside the cards 
const Post = props => (
    <Styles onClick={props.redirect}>
        <Card className="flex-row mb-4">
            <Image className="card-img" src={props.img}/>
            <Card.Body className="ml-auto d-flex flex-column align-items-center justify-content-center">
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>by Author-Nim</Card.Text>
                { 
                    props.url === '/myposts' && props.authorized ?  
                    <div className="d-flex">
                        <Button className="mr-2" text="Delete" click={props.delete}/>
                        <Button className="ml-2" text="Edit" click={props.edit}/> 
                    </div> :  null
                }                    
            </Card.Body>
        </Card>

    </Styles>
);

export default Post;