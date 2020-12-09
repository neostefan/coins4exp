import React from "react";
import Styled from "styled-components";

import axios from '../axios-inst';
import img from '../assets/biz.jpg';

const Styles = Styled.div`
    width: 100%;
    height: 100%;

    img {
        width: 100%;
        height: 100%;
        border-radius: 2px;
    }

    .img-loader {
        opacity: 0.4;
        filter: blur(4px);
        width: 100%;
        max-height: 275px;
        border-radius: 2px;
    }
`;

const Reducer = (state, action) => {
    switch (action.type) {
        case 'FETCHING_IMAGE':
            return {
                ...state,
                loading: true
            }

        case 'FETCHED_IMAGE':
            return {
                ...state,
                src: action.src,
                loading: false
            }

        default: return state
    }
}

const Image = props => {

    let [ state, dispatch ] = React.useReducer(Reducer, { src: null, loading: true });
    let root = React.useRef(null);

    React.useEffect(() => {
        let isMounted = true;
        let observer;

        let fetchImage = async () => {
            dispatch({ type: 'FETCHING_IMAGE' });
            try {
                let response = await axios.get(props.src, { responseType: 'arraybuffer' });
                let blob = "data:" + response.headers['content-type'] + ";base64," + Buffer.from(response.data, 'binary').toString('base64');
                if(isMounted) {
                    dispatch({ type: 'FETCHED_IMAGE', src: blob });
                }
            } catch(e) {
                if(isMounted) {
                    dispatch({ type: 'FETCHED_IMAGE', src: img });
                }
            }
        }

        if(IntersectionObserver) {
            observer = new IntersectionObserver(entries => {
                let intersectionRatio = entries[0].intersectionRatio;
                if(intersectionRatio > 0) {
                    fetchImage();
                    observer.unobserve(root.current);
                }
            }, {
                threshold: 0.01
            });
        } else {
            fetchImage();
        }

        observer.observe(root.current);

        return () => {
            isMounted = false;
        }

    }, [props.src]);

    return (
        <Styles ref={root}>
            { state.loading ? <img className="img-loader" src={img} alt="thumbnail"/> : <img src={state.src} alt="thumbnail"/> }
        </Styles>
    );
}

export default Image;