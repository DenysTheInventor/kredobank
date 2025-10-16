

import React, { useState, useRef, useEffect } from 'react';
// Fix: Added .ts extension to the import path.
import { getFinancialAdvice } from '../services/geminiService.ts';
// Fix: Added .tsx extension to the import path.
import { useAppContext } from '../context/AppContext.tsx';
// Fix: Added .tsx extension to the import path.
import { Send, Loader2 } from './icons.tsx';
// Fix: Added .ts extension to the import path.
import type { ChatMessage } from '../types.ts';

const ChatAssistant: React.FC = () => {
    const { t, transactions } = useAppContext();
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', text: t('chatWelcome'), sender: 'bot', timestamp: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const botThinkingMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: t('generatingResponse'),
            sender: 'bot',
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, botThinkingMessage]);
        
        const responseText = await getFinancialAdvice(input, transactions);

        const botResponseMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            text: responseText,
            sender: 'bot',
            timestamp: Date.now()
        };

        setMessages(prev => prev.slice(0, -1).concat(botResponseMessage));
        setIsLoading(false);
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <section className="flex flex-col h-[calc(100vh-220px)]">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">{t('support')}</h2>
            <div className="flex-grow overflow-y-auto space-y-4 p-2 -mx-2">
                {messages.map((msg, index) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">AI</div>}
                        <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'}`}>
                           {msg.text === t('generatingResponse') ? <Loader2 className="w-5 h-5 animate-spin" /> : msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('chatPlaceholder')}
                    className="flex-grow bg-slate-100 dark:bg-slate-800 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="bg-purple-600 text-white rounded-lg p-3 disabled:bg-purple-400 dark:disabled:bg-purple-800 disabled:cursor-not-allowed transition-colors">
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
};

export default ChatAssistant;