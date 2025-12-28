import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = ({ portfolioData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'ai',
            text: `Hi! I'm ${portfolioData?.name || 'the portfolio owner'}'s AI assistant. Ask me anything about their skills, projects, or experience!`
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage = inputMessage;
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setInputMessage('');
        setIsTyping(true);

        try {
            // Call backend API
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    portfolioData: portfolioData
                }),
            });

            const data = await response.json();

            // Add AI response
            setMessages(prev => [...prev, { type: 'ai', text: data.reply }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                type: 'ai',
                text: 'Sorry, I encountered an error. Please try again later.'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Bubble */}
            <div
                className={`chat-bubble ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <div className="bubble-icon">💬</div>
                <div className="bubble-text">Ask About Me</div>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-header-content">
                            <div className="chat-avatar">🤖</div>
                            <div className="chat-title">
                                <h4>Ask About {portfolioData?.name || 'Me'}</h4>
                                <p>AI Assistant</p>
                            </div>
                        </div>
                        <button
                            className="chat-close"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.type}-message`}
                            >
                                {msg.type === 'ai' && <div className="message-avatar">🤖</div>}
                                <div className="message-bubble">
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="message ai-message">
                                <div className="message-avatar">🤖</div>
                                <div className="message-bubble typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chat-input-container">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Ask me anything..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isTyping}
                        />
                        <button
                            className="chat-send-btn"
                            onClick={handleSendMessage}
                            disabled={isTyping || !inputMessage.trim()}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
