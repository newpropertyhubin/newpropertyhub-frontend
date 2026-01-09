import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

const VanyaChatbot = ({ onFilterUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Namaste! I am Vanya. How can I help you find your dream property today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const router = useRouter();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input;
        setMessages(prev => [...prev, { text: userText, sender: 'user' }]);
        setInput('');

        try {
            // Call the backend API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText })
            });
            
            const data = await response.json();

            // Show bot response
            setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);

            // Apply filters if any
            if (data.filters) {
                onFilterUpdate(data.filters);
            }

            // Handle redirection (e.g., for listing property)
            if (data.redirect) {
                setTimeout(() => router.push(data.redirect), 1500);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { text: "Sorry, I am having trouble connecting to the server.", sender: 'bot' }]);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, fontFamily: 'sans-serif' }}>
            {isOpen && (
                <div style={{
                    width: '320px',
                    height: '450px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    border: '1px solid #e5e7eb'
                }}>
                    {/* Header */}
                    <div style={{ backgroundColor: '#4f46e5', color: 'white', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#34d399', borderRadius: '50%' }}></div>
                            <span style={{ fontWeight: '600' }}>Vanya AI</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, padding: '16px', overflowY: 'auto', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.sender === 'user' ? '#4f46e5' : 'white',
                                color: msg.sender === 'user' ? 'white' : '#1f2937',
                                padding: '10px 14px',
                                borderRadius: '12px',
                                borderBottomRightRadius: msg.sender === 'user' ? '4px' : '12px',
                                borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '12px',
                                maxWidth: '80%',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                fontSize: '14px',
                                lineHeight: '1.4'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '12px', backgroundColor: 'white', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type here..."
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                        <button onClick={handleSend} style={{
                            backgroundColor: '#4f46e5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0 16px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}>
                            Send
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? (
                    <span style={{ fontSize: '24px' }}>&times;</span>
                ) : (
                    <span style={{ fontSize: '28px' }}>💬</span>
                )}
            </button>
        </div>
    );
};

export default VanyaChatbot;