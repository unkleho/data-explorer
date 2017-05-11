import { Component } from 'react';

class Modal extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="modal">
        {this.props.children}

        <style jsx>{`
          div {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10;
          }
        `}</style>
      </div>
    )
  }
}

export default Modal;
