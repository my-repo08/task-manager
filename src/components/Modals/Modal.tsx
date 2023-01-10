import { motion } from 'framer-motion';

interface ModalProps {
    children: React.ReactNode
    onClick: () => void
}

const Modal: React.FC<ModalProps> = ({ children, onClick }) => {
    return (
        <motion.div
            onClick={onClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
                zIndex: 1,
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(8px)'
            }}
        >
            {children}
        </motion.div>
    )
};

export default Modal;