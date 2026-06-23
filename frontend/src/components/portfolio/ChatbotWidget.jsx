import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkle, Loader2 } from 'lucide-react';
import { portfoliosApi } from '../../services/api';

export default function ChatbotWidget({ publishedUrl, chatbotSettings, developerName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: chatbotSettings?.welcomeMessage || `Hello! I am ${developerName || 'the developer'}'s virtual assistant. Ask me anything about their technical background!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Map history format: { role: 'user'|'model', parts: [{text: ''}] }
      const historyPayload = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await portfoliosApi.queryChatbot(publishedUrl, userMessage, historyPayload);
      const parsed = JSON.parse(res.data);
      const reply = parsed.reply || "I'm having trouble connecting to my knowledge bank right now.";
      
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I ran into an error processing that question." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 hover:scale-105 transition-transform flex items-center justify-center text-white shadow-xl shadow-orange-500/20 cursor-pointer"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Box card */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] glass-panel bg-black/90 border border-orange-500/20 shadow-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Header */}
          <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-amber-400">
                <Sparkle className="w-4 h-4 animate-pulse" />
              </div>
              <span className="font-bold text-xs text-white">AI Recruiting Bot</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed text-left ${
                    m.sender === 'user' 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/5 text-gray-300 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="p-3 rounded-2xl rounded-tl-none bg-white/5 border border-white/5 text-gray-400 flex items-center gap-2 select-none">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI assistant is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Form input footer */}
          <form 
            onSubmit={handleSend}
            className="p-3 border-t border-white/5 bg-white/5 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me a question about their stack..."
              className="flex-1 p-2.5 rounded-xl bg-black/40 border border-white/5 text-white text-xs outline-none focus:border-orange-500/40"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:from-orange-400 hover:to-amber-300 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
