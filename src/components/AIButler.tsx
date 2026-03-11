import { motion, AnimatePresence } from "motion/react";
import { Bot, Send, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useGemini } from "../services/gemini";
import ReactMarkdown from "react-markdown";

type AIButlerProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function AIButler({ isOpen, setIsOpen }: AIButlerProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "您好，我是鑶器木居的 AI 管家。有什麼我可以幫您的嗎？" }
  ]);
  const { sendMessage, loading } = useGemini();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await sendMessage(userMsg, history);
    if (response) {
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-20 right-4 md:bottom-24 md:right-6 w-[calc(100vw-2rem)] sm:w-80 bg-brand-white border border-brand-black shadow-2xl z-[100] flex flex-col"
        >
          <div 
            className="bg-brand-black text-brand-white p-4 flex justify-between items-center cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-2 h-2 bg-brand-white rounded-full animate-pulse"></span>
              AI ASSISTANT
            </div>
            <X className="w-4 h-4" />
          </div>
          
          <div 
            ref={scrollRef}
            className="p-4 h-64 overflow-y-auto bg-[#f4f4f5] font-mono text-xs space-y-4"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded ${msg.role === 'user' ? 'bg-brand-black text-brand-white' : 'bg-white border border-brand-black/10'}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-brand-black/10 p-4 rounded flex gap-1 items-center">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1 h-1 bg-brand-black rounded-full"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-1 h-1 bg-brand-black rounded-full"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-1 h-1 bg-brand-black rounded-full"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-brand-black flex gap-2 bg-brand-white">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full text-xs p-2 outline-none bg-transparent placeholder-brand-gray" 
              placeholder="Ask about our process..."
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="p-2 hover:bg-[#e4e4e7] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
