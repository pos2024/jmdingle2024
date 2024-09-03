import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  const modalClasses = isOpen ? 'fixed inset-0 flex items-center justify-center z-10' : 'hidden';
  return (
    <div className={modalClasses}>
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="absolute bg-white rounded-lg p-8 z-20">
        <button className="absolute top-0 right-0 p-2" onClick={onClose}>
          <svg className="w-6 h-6 fill-current text-gray-500" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.414 10l4.293-4.293a1 1 0 10-1.414-1.414L10 8.586l-4.293-4.293a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 001.414 1.414L10 11.414l4.293 4.293a1 1 0 001.414-1.414L11.414 10z"/>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
