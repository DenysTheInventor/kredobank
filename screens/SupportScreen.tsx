import React from 'react';
// Fix: Added .tsx extension to import path.
import ChatAssistant from '../components/ChatAssistant.tsx';

const SupportScreen: React.FC = () => {
    return (
        <div className="p-4 pb-20 h-screen">
            <ChatAssistant />
        </div>
    );
};

export default SupportScreen;