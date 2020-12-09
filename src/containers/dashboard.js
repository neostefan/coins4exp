import React from "react";
import Styled from "styled-components";
import {useRouteMatch} from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Progress from "react-bootstrap/ProgressBar";
import Spinner from "react-bootstrap/Spinner";

import Modal from "../components/modal";
import styles from "../themes/theme";
import axios from "../axios-inst";
import Button from "../components/button";
import limits from "../util/limit-util";
import BarChart from "../components/bar-chart";

const Styling = Styled(Container)`
    .card {
        box-shadow: 4.5px 4px 5px ${styles.aux};
    }

    .spinner-border, .spinner-grow {
        color: ${styles.color1};
    }

`;

const Reducer = (state, action) => {
  switch (action.type) {
    case 'FETCHING_SERVER_DATA':
      return {
        ...state
      }
    case 'FETCHING_ACTION_DATA':
      return {
        ...state,
        loading: true,
        type: "action"
      }
    case 'FETCHED_DATA':
      return {
        ...state,
        loading: false,
        userData: {lv: action.lv, xp: action.xp, posts: action.posts, avail: action.avail, cashed: action.cashed},
        chartData: {upvotes: {...action.upvotes}, downvotes: {...action.downvotes}}
      }
    case 'ERROR_OCCURRED':
      return {
        ...state,
        loading: false,
        show: true,
        error: action.msg
      }
    case 'ERROR_SEEN':
      return {
        ...state,
        show: false
      }
    case 'UPGRADE_SUCCESS':
      return {
        ...state,
        loading: false,
        userData: {lv: action.lv, xp: action.xp, posts: action.posts, avail: action.avail, cashed: action.cashed}
      }
    case 'WITHDRAWAL_SUCCESS':
      return {
        ...state,
        loading: false,
        show: true,
        msg: action.msg,
        userData: {lv: action.lv, xp: action.xp, posts: action.posts, avail: action.avail, cashed: action.cashed}
      }
    default: return state;
  }
}

//*convert all these multiple useState to useReducer instead and handle errors here
const Dashboard = () => {
  let match = useRouteMatch();
  let [state, dispatch] = React.useReducer(Reducer, {
    userData: { lv: 0, xp: 0, posts: 0, avail: 0, cashed: 0 }, 
    chartData: { upvotes: {}, downvotes: {} }, 
    show: false, 
    loading: true, 
    type: "default",
    error: null
  });

  React.useEffect(() => {
    dispatch({ type: "FETCHING_SERVER_DATA" });
    let isMounted = true;
    let initDashboard = async () => {
      try {
        let token = localStorage.getItem("token");
        let response = await axios.get(match.url, {
          headers: { Authorization: token },
        });
        if(isMounted) {
          let amt = limits[response.data.writer.lv][1] * response.data.writer.xp;
          dispatch({
            type: "FETCHED_DATA",
            lv: response.data.writer.lv,
            xp: response.data.writer.xp,
            posts: response.data.writer.articles.length,
            avail: +amt.toFixed(3),
            cashed: response.data.writer.cashed
          });
        }
      } catch (e) {
        if(e.response) {
          dispatch({type: "ERROR_OCCURRED", msg: e.response.data.error || "Network Error"});
        } else if(e.request) {
          dispatch({type: "ERROR_OCCURRED", msg: e.request.data.error || "Network Error"});
        }else {
          dispatch({type: "ERROR_OCCURRED", msg: e.message || "Network Error"});
        }
      }
    };

    initDashboard();
    return () => {
      isMounted = false;
    }
  }, [match.url]);

  let toggleShow = () => dispatch({type: "ERROR_SEEN"});

  let upgradeHandler = async () => {
    dispatch({ type: "FETCHING_ACTION_DATA" });
    let xpLimit = limits[state.userData.lv][0];
    let fd = new FormData();
    fd.append("xpLimit", xpLimit);

    if (state.userData.xp >= xpLimit) {
      try {
        let token = localStorage.getItem("token");
        let response = await axios.post(match.url, fd, { headers: { Authorization: token } });
        let amt = limits[response.data.writer.lv][1] * response.data.writer.xp;
        dispatch({
          type: "UPGRADE_SUCCESS",
          lv: response.data.writer.lv,
          xp: response.data.writer.xp,
          posts: response.data.writer.articles.length,
          avail: +amt.toFixed(3),
          cashed: response.data.writer.cashed
        });
      } catch (e) {
        if(e.response) {
          dispatch({type: "ERROR_OCCURRED", msg: e.response.data.error || "Network Error"});
        } else if(e.request) {
          dispatch({type: "ERROR_OCCURRED", msg: e.request.data.error || "Network Error"});
        }else {
          dispatch({type: "ERROR_OCCURRED", msg: e.message || "Network Error"});
        }
      }
    } else {
      dispatch({type: "ERROR_OCCURRED", msg: "Not Enough Experience Points For Upgrade"});
    }
  };

  let withdrawalHandler = async () => {
    dispatch({ type: "FETCHING_ACTION_DATA" });
    //send a post withdraw req
    let fd = new FormData();
    fd.append('amount', state.userData.avail);

    let token = localStorage.getItem("token");

    try {
      let response = await axios.post("/withdraw", fd, {
        headers: { Authorization: token },
      });
      let amt = limits[response.data.writer.lv][1] * response.data.writer.xp;
      dispatch({type: "WITHDRAWAL_SUCCESS", msg: response.data.msg, 
        lv: response.data.writer.lv,
        xp: response.data.writer.xp,
        posts: response.data.writer.articles.length,
        avail: +amt.toFixed(3),
        cashed: response.data.writer.cashed 
      });
      console.log(response);
    } catch (e) {
      if(e.response) {
        dispatch({type: "ERROR_OCCURRED", msg: e.response.data.error || "Network Error"});
      } else if(e.request) {
        dispatch({type: "ERROR_OCCURRED", msg: e.request.data.error || "Network Error"});
      }else {
        dispatch({type: "ERROR_OCCURRED", msg: e.message || "Network Error"});
      }
    }
  };

  return (
    <Styling>
      <Row>
        <Col sm={12} md={8}>
          <Card className="mb-2 mt-1 p-2">
            <Card.Body>
              {state.type === "default" && state.loading ? (
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" size="md" />
                </div>
              ) : <BarChart upvotes={state.chartData.upvotes} downvotes={state.chartData.downvotes}/>}
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={4}>
          <Card className="mt-1 mb-2 p-2">
            <Card.Title className="m-auto">Writer Profile</Card.Title>
            {state.type === "default" && state.loading ? (
              <div className="d-flex justify-content-center">
                <Spinner animation="border" size="md" />
              </div>
            ) : (
              <Card.Body>
                <Card.Text className="mb-0">LV {state.userData.lv}</Card.Text>
                <Progress
                  className="mb-1"
                  striped
                  now={state.userData.xp}
                  label={`${state.userData.xp}/${limits[state.userData.lv][0]}`}
                  max={limits[state.userData.lv][0]}
                />
                {state.type === "action" && state.loading ? (
                  <Spinner animation="grow" role="status" />
                ) : (
                  <Button type="submit" text="upgrade" click={upgradeHandler} />
                )}
                <Card.Text className="mb-0 mt-4">Posts</Card.Text>
                <h3 className="mt-0 mb-0">{state.userData.posts}</h3>
                <Card.Text className="mb-0 mt-4">Amount Available</Card.Text>
                <div className="d-flex">
                  <h4 className="mt-0 mb-0 mr-2">{state.userData.avail} trx</h4>
                  {state.type === "action" && state.loading ? (
                    <Spinner animation="grow" role="status" />
                  ) : (
                    <Button
                      type="submit"
                      text="withdraw"
                      click={withdrawalHandler}
                    />
                  )}
                </div>
                <Card.Text className="mb-0 mt-4">Amount Withdrawn</Card.Text>
                <h4 className="mt-0 mb-0">{state.userData.cashed} trx</h4>
              </Card.Body>
            )}
          </Card>
          <Modal title="Notification" show={state.show} close={toggleShow}>
            { state.error ?
              <h5>{state.error}</h5> :
              <h5>{state.msg}</h5> 
            }
          </Modal>
        </Col>
      </Row>
    </Styling>
  );
};

export default Dashboard;
