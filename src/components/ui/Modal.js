import reactDom from "react-dom";
import styles from "./Modal.module.scss"
import { MdClose } from "react-icons/md";

const ModalOverlay = ({ children, onClose, closeWhite }) => {
    return <div className={`${styles.modal} ${closeWhite ? styles.closeWhite : ''}`}>
        <MdClose onClick={onClose} />
        {children}
    </div>
}


const Modal = ({ children, onClose, closeWhite }) => {

    return (
        <>
            {reactDom.createPortal(<div className={styles.backdrop} onClick={onClose} />, document.getElementById('overlays'))}
            {reactDom.createPortal(<ModalOverlay closeWhite={closeWhite} onClose={onClose}>{children}</ModalOverlay>, document.getElementById('overlays'))}
        </>
    )
};

export default Modal;
