import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Bot, User, Image as ImageIcon, Camera, Upload, Mic, Volume2, VolumeX } from "lucide-react";
import { generateAIResponse } from "../lib/gemini";
import { supabase } from "../lib/supabase";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; text: string; image?: string }[]>([
    {
      id: "1",
      role: "assistant",
      text: "Hi! 👋 I'm the CivicLens AI Assistant. I can access your reports, check statuses, and help with civic issues. Try asking: 'Show my reports' or 'What's the status of my latest report?'"
    }
  ]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Fetch database context for AI
  const getDatabaseContext = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return "";

      // Fetch user's reports
      const { data: reports } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch user's responses
      const { data: responses } = await supabase
        .from("report_responses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      // Build context
      let context = "\n\n[DATABASE CONTEXT - Use this to answer user questions]:\n";
      
      if (reports && reports.length > 0) {
        context += `\nUser's Reports (${reports.length} total):\n`;
        reports.forEach((r: any, i: number) => {
          context += `${i + 1}. ${r.issue_type} - Status: ${r.status} - Location: ${r.location || 'N/A'} - Created: ${new Date(r.created_at).toLocaleDateString()}\n`;
          if (r.description) context += `   Description: ${r.description}\n`;
        });
      } else {
        context += "\nUser has no reports yet.\n";
      }

      if (responses && responses.length > 0) {
        context += `\nRecent Official Responses (${responses.length}):\n`;
        responses.forEach((r: any, i: number) => {
          context += `${i + 1}. ${r.responder_name}: ${r.response_text}\n`;
        });
      }

      return context;
    } catch (error) {
      console.error("Error fetching database context:", error);
      return "";
    }
  };

  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      text: input || "Sent an image",
      image: selectedImage || undefined
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    const currentImage = selectedImage;
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Get database context
      const dbContext = await getDatabaseContext();
      
      // Call real Gemini AI with database context
      const aiResponse = await generateAIResponse(
        messages,
        currentInput + dbContext,
        currentImage || undefined
      );

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        text: aiResponse
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Speak the response
      if (voiceEnabled) {
        speakText(aiResponse);
      }
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        text: "Sorry, I encountered an error. Please try again."
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-civic-teal to-civic-darkBlue text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
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
            className="fixed z-[60] bg-white shadow-2xl rounded-2xl md:rounded-3xl border border-slate-200 flex flex-col inset-x-2 bottom-2 top-16 md:bottom-24 md:right-6 md:left-auto md:top-auto md:w-[420px] md:h-[650px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white p-3 md:p-4 rounded-t-2xl">
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
                      {isSpeaking && <Volume2 className="w-3 h-3 animate-pulse" />}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                    title={voiceEnabled ? "Disable voice replies" : "Enable voice replies"}
                  >
                    {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-slate-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar with animation */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 relative ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-civic-teal to-civic-darkBlue text-white"
                        : "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <>
                        {/* AI Avatar with mouth animation */}
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                          {/* Animated mouth when speaking */}
                          {isSpeaking && messages[messages.length - 1]?.id === message.id && (
                            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2">
                              <div className="w-2 h-0.5 bg-white rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                        {/* Speaking indicator - animated circle */}
                        {isSpeaking && messages[messages.length - 1]?.id === message.id && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
                        )}
                      </>
                    )}
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
            <div className="border-t border-slate-200 p-2 md:p-3 bg-white rounded-b-2xl">
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
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`w-10 h-10 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-purple-500'} text-white rounded-xl hover:opacity-90 transition-all flex items-center justify-center flex-shrink-0`}
                  title={isListening ? "Stop listening" : "Voice input"}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const input = fileInputRef.current;
                    if (input) {
                      input.setAttribute('capture', 'environment');
                      input.click();
                    }
                  }}
                  className="w-10 h-10 bg-civic-teal/10 border-2 border-civic-teal text-civic-teal rounded-xl hover:bg-civic-teal hover:text-white transition-all flex items-center justify-center flex-shrink-0"
                  title="Take photo"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const input = fileInputRef.current;
                    if (input) {
                      input.removeAttribute('capture');
                      input.click();
                    }
                  }}
                  className="w-10 h-10 bg-slate-100 border-2 border-slate-300 text-slate-600 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center flex-shrink-0"
                  title="Upload file"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2.5 border-2 border-slate-300 rounded-xl focus:border-civic-teal focus:ring-2 focus:ring-civic-teal/20 outline-none text-sm md:text-base text-slate-900 placeholder-slate-400 bg-white"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={isLoading || (!input.trim() && !selectedImage)}
                  className="w-10 h-10 bg-gradient-to-br from-civic-teal to-civic-darkBlue text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center flex-shrink-0"
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