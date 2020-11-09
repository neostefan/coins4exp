import React from "react";
import Styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../themes/theme';

const Styles = Styled(Container)`
    .accordion {
        background-color: ${styles.light02};
        color: ${styles.color1};
    }

    .card {
        padding: 2px;
    }

    .card-title {
        color: ${styles.aux};
        text-align: center;
    }

    .card-header {
        color: ${styles.aux};

        &:hover {
            cursor: pointer;
        }
    }
`;

const About = () => (
    <Styles fluid>
        <Row>
            <Col md={3}/>
            <Col sm={12} md={6}>
                <Accordion>
                    <Card>
                        <Card.Title>FAQ</Card.Title>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                            What is the site about  <FontAwesomeIcon icon={faArrowRight}/>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                Coins4experience is an experience sharing platform that leverages the tron
                                blockchain to allow content creators earn tron tokens
                                based on each reaction on their experience shared on the platform.
                            </Card.Body>
                        </Accordion.Collapse>
                        <Accordion.Toggle as={Card.Header} eventKey="1">
                            How do i earn tron tokens  <FontAwesomeIcon icon={faArrowRight}/>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                It's quite simple all you have to do is write relevant articles 
                                irrespective of topic and share the articles based on the number of reactions
                                your articles get you'll be awarded tron tokens in return.
                            </Card.Body>
                        </Accordion.Collapse>
                        <Accordion.Toggle as={Card.Header} eventKey="2">
                            What is with all the extras on my profile <FontAwesomeIcon icon={faArrowRight}/>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="2">
                            <Card.Body>
                                Coins4experience besides leveraging blockchain technology also has it's
                                platform built in a way that provides a gamified experience so just like 
                                how in games you level up and and each level comes with harder challenges but
                                nice rewards the same applies here reactions on each of your articles form your
                                experience points which you use to either level up or withdraw tron tokens.
                            </Card.Body>
                        </Accordion.Collapse>
                        <Accordion.Toggle as={Card.Header} eventKey="3">
                            Is there a withdrawal threshold <FontAwesomeIcon icon={faArrowRight}/>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="3">
                            <Card.Body>
                                No withdrawal limits/threshold you are allowed to withdraw any amount of
                                experience points
                            </Card.Body>
                        </Accordion.Collapse>
                        <Accordion.Toggle as={Card.Header} eventKey="4">
                            I don't have a tron wallet what do i do <FontAwesomeIcon icon={faArrowRight}/>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="4">
                            <Card.Body>
                                You would have to create one before you join we only need your wallet address
                                as that is where the funds will be sent once we have that we send the tron tokens 
                                instantly to your address check here for how to create a tron wallet address
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </Col>
            <Col md={3}/>
        </Row>
    </Styles>
);

export default About;