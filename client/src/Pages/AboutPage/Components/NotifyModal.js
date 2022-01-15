import React from "react";
import "./NotifyModal.scss";

function NotifyModal({ closeModal, showModal }) {
    return (
        <div className="modal__container">
            <div className="modal">
                <div>Listing completed</div>
                <button className="modal__button" onClick={closeModal}>
                    Modal close
                </button>
            </div>
        </div>
    );
}

export default NotifyModal;
