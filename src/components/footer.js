import React from "react";
import Styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  faInfoCircle,
  faArchive,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faUser,
  faFileArchive,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Modal from "./modal";
import Subscription from "./subscription";
import LogIn from "./login";
import SignUp from "./signup";
import styles from "../themes/theme";
import Aux from "../hoc/aux";
import status from "../store/atoms";

const Styles = Styled.footer`
    background-color: ${styles.aux};
    color: ${styles.color0};
    height: auto;
    line-height: 25px;
    width: 100%;
    margin: auto;
    z-index: 3;

    .opt-icon {
        &:hover {
            cursor: pointer;
        }
    }
`;

const Footer = () => {
  let [auth, setAuth] = useRecoilState(status);
  let history = useHistory();
  let [subShow, setSubShow] = React.useState(false);
  let [authShow, setAuthShow] = React.useState({
    show: false,
    type: "sign-in",
  });

  let aboutHandler = () => history.push("/faq");

  let myPostsHandler = () => history.push("/myposts");

  let postsHandler = () => history.push({ pathname: "/posts", state: undefined });

  let dashBoardHandler = () => history.push("/d");

  let writeHandler = () => history.push("/add");

  let toggleSubModal = () => setSubShow(!subShow);

  let toggleAuthModal = (type = "sign-in") =>
    setAuthShow({ show: !authShow.show, type });

  let signOutHandler = () => {
    setAuth({ isLoggedIn: false, writerId: 0 });
    localStorage.removeItem("token");
    localStorage.removeItem("expires");
    history.push("/");
  };

  return (
    <Styles className="fixed-bottom d-flex justify-content-center justify-content-around p-2">
      {/* <div
        className="d-flex flex-column align-items-center opt-icon"
        onClick={toggleSubModal}
      >
        <FontAwesomeIcon icon={faNewspaper} />
        <small>Subcribe</small>
      </div> */}
      <div
        className="d-flex flex-column align-items-center opt-icon"
        onClick={postsHandler}
      >
        <FontAwesomeIcon icon={faFileArchive} />
        <small>Posts</small>
      </div>
      {auth.isLoggedIn ? (
        <Aux>
		  <div
			className="d-flex flex-column align-items-center opt-icon"
			onClick={writeHandler}
		  >
			<FontAwesomeIcon icon={faFileUpload}/>
			<small>Write</small>
		  </div>
          <div
            className="d-flex flex-column align-items-center opt-icon"
            onClick={dashBoardHandler}
          >
            <FontAwesomeIcon icon={faUser} />
            <small>Dashboard</small>
          </div>
          <div
            className="d-flex flex-column align-items-center opt-icon"
            onClick={myPostsHandler}
          >
            <FontAwesomeIcon icon={faArchive} />
            <small>Archive</small>
          </div>
          <div
            className="d-flex flex-column align-items-center opt-icon"
            onClick={signOutHandler}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <small>Sign Out</small>
          </div>
        </Aux>
      ) : (
        <Aux>
          <div
            className="d-flex flex-column align-items-center opt-icon"
            onClick={() => toggleAuthModal("join")}
          >
            <FontAwesomeIcon icon={faUserPlus} />
            <small>Join</small>
          </div>
          <div
            className="d-flex flex-column align-items-center opt-icon"
            onClick={toggleAuthModal}
          >
            <FontAwesomeIcon icon={faSignInAlt} />
            <small>Sign In</small>
          </div>
        </Aux>
      )}
      <div
        className="d-flex flex-column align-items-center opt-icon"
        onClick={aboutHandler}
      >
        <FontAwesomeIcon icon={faInfoCircle} />
        <small>FAQ</small>
      </div>
      <Modal
        show={subShow}
        isForm={true}
        close={toggleSubModal}
        title="Subcribe To Our Newsletter"
      >
        <Subscription close={toggleSubModal} />
      </Modal>
      <Modal
        show={authShow.show}
        isForm={true}
        close={toggleAuthModal}
        title="Sign In"
      >
        {authShow.type !== "join" ? (
          <LogIn close={toggleAuthModal} />
        ) : (
          <SignUp />
        )}
      </Modal>
    </Styles>
  );
};

export default Footer;
