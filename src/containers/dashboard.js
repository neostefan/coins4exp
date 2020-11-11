import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Progress from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';

import Modal from '../components/modal';
import styles from '../themes/theme';
import axios from '../axios-inst';
import Button from '../components/button';
import limits from '../util/limit-util';
import errorHandler from '../hoc/errorhandler';

const Styling = Styled(Container)`
    .card {
        box-shadow: -4.5px 4px 5px ${styles.aux};
    }

    .spinner-border, .spinner-grow {
        color: ${styles.color1};
    }

`;

const Dashboard = props => {

    let [data, setData] = useState({lv: 0, xp: 0, posts: 0, avail: 0});
    let [show, setShow] = useState(false);
    let [loading, setLoading] = useState({type: 'default', value: false});

    useEffect(() => {
        let initDashboard = async () => {
            try {
                setLoading({type: 'default', value: true});
                let token = localStorage.getItem('token');
                let response = await axios.get(props.match.url, { headers: { "Authorization": token } });
                setLoading({type: 'default', value: false});
                console.log(response.data);
                let amt = limits[response.data.writer.lv][1] * response.data.writer.xp;
                console.log(amt);
                console.log(response.data.writer.cashed);
                setData({ lv: response.data.writer.lv, xp: response.data.writer.xp, 
                    posts: response.data.writer.articles.length, avail: +amt.toFixed(3)});
                
            } catch (e) {
                console.log(e);
            }
        }

        initDashboard();
    }, [props.match.url]);

    let toggleShow = () => {
        setShow(!show);
    }

    let upgradeHandler = async () => {
        setLoading({type: 'upgrade', value: true});
        let xpLimit = limits[data.lv][0];
        let fd = new FormData();
        fd.append('xpLimit', xpLimit);

        if(data.xp >= xpLimit) {
            try {
                let token = localStorage.getItem('token');
                let response = await axios.post(props.match.url, fd, { headers: { "Authorization": token }});
                setData({lv: response.data.writer.lv, xp: response.data.writer.xp, posts: response.data.writer.articles.length});
                setLoading({type: 'default', value: false});
                console.log(response.data);
            } catch(e) {
                console.log(e);
                setLoading({type: 'default', value: false});
            }
        } else {
            setShow(true);
            setLoading({type: 'default', value: false});
        }
    }

    let withdrawalHandler = async () => {
        //send a post withdraw req
        setLoading({type: 'withdraw', value: true});
    }

    return (
        <Styling>
            <Row>
                <Col xs={12} md={8}>
                    <Card className="mb-2 mt-1 p-2">
                        <Card.Title className="m-auto">Reaction Data</Card.Title>
                        <Card.Body>
                            { 
                                (loading.type === 'default' && loading.value) ?
                                    <div className="d-flex justify-content-center">
                                        <Spinner animation="border" size="md"/> 
                                    </div>  : null
                            }
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card className="mt-1 mb-2 p-2">
                        <Card.Title className="m-auto">Writer Profile</Card.Title>
                        { (loading.type === 'default' && loading.value) ? 
                            <div className="d-flex justify-content-center">
                                <Spinner animation="border" size="md"/> 
                            </div>  :
                            <Card.Body>
                                <Card.Text className="mb-0">LV {data.lv}</Card.Text>
                                <Progress className="mb-1" striped now={data.xp} label={`${data.xp}/${limits[data.lv][0]}`} max={limits[data.lv][0]}/>
                                { 
                                        (loading.type === 'upgrade' && loading.value) ? 
                                        <Spinner animation="grow" role="status"/> :
                                        <Button type="submit" text="upgrade" click={upgradeHandler}/>
                                }
                                <Card.Text className="mb-0 mt-4">Posts</Card.Text>
                                <h3 className="mt-0 mb-0">{data.posts}</h3>
                                <Card.Text className="mb-0 mt-4">Amount Available</Card.Text>
                                <div className="d-flex">
                                    <h4 className="mt-0 mb-0 mr-2">{data.avail} trx</h4>
                                    { 
                                        (loading.type === 'withdraw' && loading.value) ? 
                                        <Spinner animation="grow" role="status"/> :
                                        <Button type="submit" text="withdraw" click={withdrawalHandler}/>
                                    }
                                </div>
                                <Card.Text className="mb-0 mt-4">Amount Withdrawn</Card.Text>
                                <h4 className="mt-0 mb-0">{1500.099} trx</h4>
                            </Card.Body>
                        }
                    </Card>
                    <Modal title="Notification" show={show} close={toggleShow}>
                        <h5>Not enough experience points</h5>
                    </Modal>
                </Col>
            </Row>
        </Styling>
    );
};

export default errorHandler(Dashboard, axios);