import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Bot, User, Image as ImageIcon } from "lucide-react";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; text: string; image?: string }[]>([
    {
      id: "1",
      role: "assistant",
      text: "Hi! 👋 I'm the CivicLens AI Assistant. I can help you understand civic issues, analyze reports, and provide insights. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      text: input || "Sent an image",
      image: selectedImage || undefined
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responses = selectedImage
        ? [
            "I can see the image you shared. This appears to be a civic issue that needs attention.",
            "Thanks for sharing the image! I can analyze this and provide insights.",
            "Based on the image, I can help categorize this issue for better tracking.",
            "Great! I've analyzed the image. Let me help you with this civic matter."
          ]
        : [
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-civic-teal to-civic-darkBlue text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Modern Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 bg-white shadow-2xl rounded-2xl border border-slate-200 flex flex-col bottom-4 right-4 left-4 md:bottom-24 md:right-6 md:left-auto md:w-[420px] h-[calc(100vh-6rem)] md:h-[650px] max-h-[calc(100vh-6rem)]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white p-4 rounded-t-2xl">
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-civic-teal to-civic-darkBlue text-white"
                        : "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                    }`}
                  >
                    {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col max-w-[80%]">
                    <div
                      className={`px-3 py-2.5 rounded-2xl ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-civic-teal to-civic-darkBlue text-white"
                          : "bg-white border border-slate-200 text-slate-900"
                      }`}
                    >
                      {message.image && (
                        <img src={message.image} alt="Uploaded" className="rounded-lg mb-2 max-w-full h-auto" />
                      )}
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <p className={`text-[10px] mt-1 px-1 ${message.role === "user" ? "text-right text-slate-400" : "text-slate-400"}`}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-200 px-3 py-2.5 rounded-2xl">
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
            <div className="border-t border-slate-200 p-3 bg-white rounded-b-2xl">
              {/* Image Preview */}
              {selectedImage && (
                <div className="mb-2 relative inline-block">
                  <img src={selectedImage} alt="Preview" className="h-20 rounded-lg" />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center flex-shrink-0"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2.5 border border-slate-300 rounded-xl focus:border-civic-teal focus:outline-none text-sm text-slate-900 placeholder-slate-400 bg-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || (!input.trim() && !selectedImage)}
                  className="w-10 h-10 bg-gradient-to-br from-civic-teal to-civic-darkBlue text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}