"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, MessageSquare } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  type: "text" | "image";
  imageUrl?: string;
}

export default function ChatDemoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. I can help you with text conversations or generate images. What would you like to do?",
      role: "assistant",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isImageMode, setIsImageMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
      type: isImageMode ? "image" : "text",
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: isImageMode 
          ? `I've generated an image based on: "${inputValue}". Here's what I created for you:`
          : `I received your message: "${inputValue}". This is a demo response.`,
        role: "assistant",
        timestamp: new Date(),
        type: isImageMode ? "image" : "text",
        imageUrl: isImageMode ? "/placeholder-image.jpg" : undefined,
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleModeToggle = (mode: "text" | "image") => {
    setIsImageMode(mode === "image");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-colors duration-200">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-100">GPT Image Generator</h1>
              <p className="text-sm text-gray-400">Text conversations and image generation</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
          {/* Messages Container */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 animate-in fade-in duration-300 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="p-2 bg-blue-600/20 rounded-full hover:bg-blue-600/30 transition-colors duration-200">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 ${
                    message.role === "user"
                      ? message.type === "image" 
                        ? "bg-purple-600/20 border border-purple-500/30 text-purple-100 hover:bg-purple-600/30"
                        : "bg-blue-600/20 border border-blue-500/30 text-blue-100 hover:bg-blue-600/30"
                      : message.type === "image"
                        ? "bg-gray-700/50 border border-gray-600/50 text-gray-100 hover:bg-gray-700/70"
                        : "bg-gray-700/50 border border-gray-600/50 text-gray-100 hover:bg-gray-700/70"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {/* Display generated image if present */}
                  {message.type === "image" && message.imageUrl && (
                    <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/50 hover:border-gray-500/50 transition-colors duration-200">
                        <div className="w-full h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border-2 border-dashed border-gray-500/50 flex items-center justify-center hover:border-gray-400/50 transition-colors duration-200 group">
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2 group-hover:text-gray-300 transition-colors duration-200" />
                            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">Generated Image Placeholder</p>
                            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors duration-200">This would be the actual AI-generated image</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p
                    className={`text-xs mt-3 ${
                      message.role === "user" 
                        ? message.type === "image" ? "text-purple-300" : "text-blue-300"
                        : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className={`p-2 rounded-full hover:scale-110 transition-transform duration-200 ${
                    message.type === "image" 
                      ? "bg-purple-600/20" 
                      : "bg-blue-600/20"
                  }`}>
                    {message.type === "image" ? (
                      <ImageIcon className="w-4 h-4 text-purple-400" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700/50 p-6 bg-gray-800/30">
            {/* Mode Toggle */}
            <div className="flex justify-center mb-4">
              <div className="bg-gray-700/50 rounded-lg p-1 border border-gray-600/50 shadow-lg">
                <button
                  onClick={() => handleModeToggle("text")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    !isImageMode
                      ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-600/50"
                  }`}
                  aria-label="Switch to text chat mode"
                >
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Text Chat
                </button>
                <button
                  onClick={() => handleModeToggle("image")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    isImageMode
                      ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-600/50"
                  }`}
                  aria-label="Switch to image generation mode"
                >
                  <ImageIcon className="w-4 h-4 inline mr-2" />
                  Create Image
                </button>
              </div>
            </div>

            {/* Input Field */}
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isImageMode 
                    ? "Describe the image you want to create..." 
                    : "Type your message here..."
                }
                className={`flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 hover:border-gray-500/50 ${
                  isImageMode 
                    ? "focus:ring-purple-500/50 focus:border-purple-500/50" 
                    : "focus:ring-blue-500/50 focus:border-blue-500/50"
                }`}
                aria-label={isImageMode ? "Image description input" : "Message input"}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${
                  isImageMode
                    ? "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white"
                }`}
                aria-label={isImageMode ? "Generate image" : "Send message"}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            This is a demo interface. Connect it to your AI services for real functionality.
          </p>
        </div>
      </main>
    </div>
  );
}
