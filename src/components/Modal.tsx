import React from 'react';

interface ModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

function Modal({ isOpen, title, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
}

export default Modal;
