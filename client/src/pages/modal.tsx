import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6">
        {children}
        <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 rounded py-2 px-4 mt-4">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;