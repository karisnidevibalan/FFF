import React from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    X
} from 'lucide-react';

interface AIFloatingActionsProps {
    onAction: (actionId: string) => void;
    isChatOpen: boolean;
    onToggleChat: () => void;
}

const AIFloatingActions: React.FC<AIFloatingActionsProps> = ({
    onAction,
    isChatOpen,
    onToggleChat
}) => {
    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Main AI Chat Button */}
            <motion.button
                onClick={onToggleChat}
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${isChatOpen ? 'bg-destructive text-destructive-foreground rotate-90' : 'gradient-bg text-primary-foreground'
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={!isChatOpen ? {
                    boxShadow: [
                        "0 0 0 0px rgba(59, 130, 246, 0.4)",
                        "0 0 0 15px rgba(59, 130, 246, 0)",
                        "0 0 0 0px rgba(59, 130, 246, 0)"
                    ]
                } : {}}
                transition={!isChatOpen ? {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                } : {}}
            >
                {isChatOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
            </motion.button>
        </div>
    );
};

export default AIFloatingActions;
