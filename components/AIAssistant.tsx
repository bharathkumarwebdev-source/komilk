import React, { useState, useRef, useEffect } from 'react';
import { generateMilkAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'intro', role: 'model', text: "Namaste! I'm your KO-MILK assistant. Ask me about our fresh milk varieties!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateMilkAdvice(input);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1060 }}>
      {/* Chat Window */}
      {isOpen && (
        <div className="card shadow-lg mb-3" style={{ width: '350px', height: '500px', borderRadius: '15px', border: 'none', overflow: 'hidden' }}>
          {/* Header */}
          <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#0099cc' }}>
            <div className="d-flex align-items-center gap-2">
              <div className="bg-white rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                <Bot size={18} color="#0099cc" />
              </div>
              <div>
                <h6 className="mb-0 fw-bold">KO-MILK Bot</h6>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="btn btn-sm text-white p-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="card-body overflow-auto bg-light d-flex flex-column gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`p-2 px-3 rounded-3 shadow-sm ${
                    msg.role === 'user'
                      ? 'text-white'
                      : 'bg-white text-dark border'
                  }`}
                  style={{ 
                    maxWidth: '85%', 
                    fontSize: '0.9rem',
                    backgroundColor: msg.role === 'user' ? '#0099cc' : 'white' 
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="d-flex justify-content-start">
                <div className="bg-white border p-2 px-3 rounded-3 shadow-sm d-flex align-items-center gap-2">
                  <Sparkles size={16} className="text-info spinner-border spinner-border-sm border-0" />
                  <span className="small text-muted">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="card-footer bg-white border-top p-2">
            <div className="input-group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question..."
                className="form-control border-0 bg-light shadow-none"
                disabled={isLoading}
                style={{ borderRadius: '10px' }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="btn btn-primary ms-2 rounded-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: '#0099cc', border: 'none' }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn rounded-circle shadow-lg d-flex align-items-center justify-content-center"
        style={{ 
          width: '60px', 
          height: '60px', 
          backgroundColor: isOpen ? '#333' : '#0099cc',
          color: 'white',
          border: 'none',
          transition: 'all 0.3s'
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default AIAssistant;