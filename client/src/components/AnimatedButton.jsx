import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const AnimatedButton = ({
    children,
    onClick,
    isLoading = false,
    disabled = false,
    className = "btn btn-primary",
    style = {},
    type = "button"
}) => {
    return (
        <motion.button
            type={type}
            onClick={!isLoading && !disabled ? onClick : undefined}
            disabled={isLoading || disabled}
            className={className}
            style={{
                ...style,
                opacity: (isLoading || disabled) ? 0.7 : 1,
                cursor: (isLoading || disabled) ? 'not-allowed' : 'pointer'
            }}
            whileHover={!isLoading && !disabled ? { scale: 1.02, boxShadow: "0 8px 15px rgba(0, 135, 83, 0.2)" } : {}}
            whileTap={!isLoading && !disabled ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {isLoading ? (
                <>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                        <Loader2 size={20} />
                    </motion.div>
                    <span>Processing...</span>
                </>
            ) : (
                children
            )}
        </motion.button>
    );
};

export default AnimatedButton;
