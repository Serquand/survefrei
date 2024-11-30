interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: JSX.Element
}


const Modal = (props: ModalProps) => {
    return (
        <>
            {props.isOpen && (
                <div className="fixed inset-0 bg-gray-900/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Modal Title</h3>
                            <button
                                onClick={props.onClose}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="mt-4">
                            {props.children}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;