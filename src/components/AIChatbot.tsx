import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; text: string }[]>([
    {
      id: "1",
      role: "assistant",
      text: "Hi! 👋 I'm the CivicLens AI Assistant. I can help you understand civic issues, analyze reports, and provide insights. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      text: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on civic data, I can help you with that.",
        "I'm analyzing the information you provided. Here's what I found...",
        "Thanks for asking! Let me help you with insights on this civic issue.",
        "I understand. This is an important matter for our community.",
        "Based on similar civic reports, here's what typically helps..."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        text: randomResponse
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Modern Chatbot Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 bottom-20 md:right-6 md:bottom-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-civic-teal to-civic-darkBlue text-white shadow-xl flex items-center justify-center z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Modern Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className={
              `fixed z-50 bg-white shadow-2xl border border-slate-200 flex flex-col ` +
              (typeof window !== "undefined" && window.innerWidth < 640
                ? "inset-x-0 bottom-0 top-0 h-full"
                : "bottom-24 right-6 w-[420px] h-[650px] rounded-2xl")
            }
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">CivicLens AI</h3>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <p className="text-xs text-white/90">Online</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-civic-teal to-civic-darkBlue text-white"
                        : "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                    }`}
                  >
                    {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col max-w-[75%]">
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-civic-teal to-civic-darkBlue text-white"
                          : "bg-white border border-slate-200 text-slate-900"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <p className={`text-xs mt-1 px-1 ${message.role === "user" ? "text-right text-slate-400" : "text-slate-400"}`}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 p-4 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:border-civic-teal focus:outline-none text-slate-900 placeholder-slate-400 bg-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="w-11 h-11 bg-gradient-to-br from-civic-teal to-civic-darkBlue text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
