import React, { Component } from 'react';
import Modal from '../components/modal';
import Aux from './aux';

const errorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            hasError: false,
            errorMsg: null,
            status: 400,
            show: true
        }

        componentDidMount() {
            this.requestInterceptor = axios.interceptors.request.use(req => req, (err) => {
                if(err) {
                    if(err.request) {
                        this.setState(prevstate => ({...prevstate, hasError: true, 
                            errorMsg: err.request.data.error, status: err.request.status}));
                    } else {
                        this.setState(prevstate => ({...prevstate, hasError: true, 
                            errorMsg: err.message, status: err.status}));
                    }
                }
            });

            this.responseInterceptor = axios.interceptors.response.use(res => res, (err) => {
                if(err) {
                    if(err.response) {
                        this.setState(prevstate => ({...prevstate, hasError: true, 
                            status: err.response.status, 
                            errorMsg: err.response.data.error}));
                    } else {
                        this.setState(prevstate => ({...prevstate, hasError: true, 
                            status: err.status, 
                            errorMsg: err.message}));
                    }
                }
            });
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.requestInterceptor);
            axios.interceptors.response.eject(this.responseInterceptor);
        }
    
        toggleShow = () => {
            this.setState(prevstate => ({...prevstate, show: false}));
        }
    
        render() {
            if(this.state.hasError) {
                return (
                    <Aux>
                        <Modal show={this.state.show} title="Error" close={this.toggleShow}>
                            <h3>{this.state.status || 500}</h3>
                            <h6>{this.state.errorMsg || 'Network Error'}</h6>
                        </Modal>
                        <WrappedComponent {...this.props}/>
                    </Aux>
                )
            } else {
                return (<WrappedComponent {...this.props}/>);
            }
        }
    }
}

export default errorHandler;