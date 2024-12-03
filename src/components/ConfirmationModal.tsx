import React, { ReactNode } from "react";

interface ConfirmationModalProps {
    children: ReactNode;
    onValidate: () => void;
    onCancel: () => void;
    isOpen: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ children, isOpen, onCancel, onValidate }) => {
    if(!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white rounded shadow p-6 w-1/3">
                    <div className="mb-4">{children}</div>
                    <div className="flex justify-end">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mr-3"
                            onClick={onCancel}
                        >
                            Annuler
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={onValidate}
                        >
                            Confirmer
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmationModal;
