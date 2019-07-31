import React from 'react';
import ReactDOM from 'react-dom';

export default class ModalPortal extends React.Component {
    constructor() {
        super();
        this.el = document.createElement("div");
    }

    getPortalRoot = () => {
        return document.getElementById('modal-wrapper');
    }

    componentDidMount = () => {
        const portalRoot = this.getPortalRoot();
        if (portalRoot !== null) {
            portalRoot.appendChild(this.el);
        }
    };

    componentWillUnmount = () => {
        const portalRoot = this.getPortalRoot();
        if (portalRoot !== null) {
            portalRoot.removeChild(this.el);
        }
    };

    render() {
        const { children } = this.props;
        return ReactDOM.createPortal(children, this.el);
    }
}