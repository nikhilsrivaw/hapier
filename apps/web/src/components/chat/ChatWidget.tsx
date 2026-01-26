'use client';                                                                                            
  import { useState, useRef, useEffect } from 'react';                                                  
  import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { motion, AnimatePresence } from 'framer-motion';
  import { aiService } from '@/services/ai.service';

  interface Message {
      id: string;
      role: 'user' | 'assistant';
      content: string;
  }

  export default function ChatWidget() {
      const [isOpen, setIsOpen] = useState(false);
      const [messages, setMessages] = useState<Message[]>([
          { id: '1', role: 'assistant', content: 'Hi! I\'m Hapier AI, your HR assistant. How can I helpyou today?' }
      ]);
      const [input, setInput] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const messagesEndRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);

      const sendMessage = async () => {
          if (!input.trim() || isLoading) return;

          const userMessage: Message = {
              id: Date.now().toString(),
              role: 'user',
              content: input.trim()
          };

          setMessages(prev => [...prev, userMessage]);
          setInput('');
          setIsLoading(true);

          try {
              const { response } = await aiService.chat(userMessage.content);
              const assistantMessage: Message = {
                  id: (Date.now() + 1).toString(),
                  role: 'assistant',
                  content: response
              };
              setMessages(prev => [...prev, assistantMessage]);
          } catch (error) {
              setMessages(prev => [...prev, {
                  id: (Date.now() + 1).toString(),
                  role: 'assistant',
                  content: 'Sorry, I encountered an error. Please try again.'
              }]);
          } finally {
              setIsLoading(false);
          }
      };

      return (
          <>
              {/* Chat Button */}
              <motion.button
                  onClick={() => setIsOpen(true)}
                  className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white 
  rounded-full shadow-lg flex items-center justify-center z-50 ${isOpen ? 'hidden' : ''}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
              >
                  <MessageCircle className="w-6 h-6" />
              </motion.button>

              {/* Chat Window */}
              <AnimatePresence>
                  {isOpen && (
                      <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.95 }}
                          className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-900    
  rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 overflow-hidden"
                      >
                          {/* Header */}
                          <div className="flex items-center justify-between p-4 border-b border-gray-200
   dark:border-gray-700 bg-blue-600 text-white">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center  
  justify-center">
                                      <Bot className="w-5 h-5" />
                                  </div>
                                  <div>
                                      <h3 className="font-semibold">Hapier AI</h3>
                                      <p className="text-xs text-blue-100">Your HR Assistant</p>        
                                  </div>
                              </div>
                              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 
  rounded-full">
                                  <X className="w-5 h-5" />
                              </button>
                          </div>

                          {/* Messages */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-4">
                              {messages.map((msg) => (
                                  <div key={msg.id} className={`flex ${msg.role === 'user' ?
  'justify-end' : 'justify-start'}`}>
                                      <div className={`flex items-start gap-2 max-w-[80%] ${msg.role ===
   'user' ? 'flex-row-reverse' : ''}`}>
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot
   className="w-4 h-4" />}
                                          </div>
                                          <div className={`px-4 py-2 rounded-2xl ${msg.role === 'user' ?
   'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}>       
                                              <p className="text-sm
  whitespace-pre-wrap">{msg.content}</p>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                              {isLoading && (
                                  <div className="flex justify-start">
                                      <div className="flex items-start gap-2">
                                          <div className="w-8 h-8 rounded-full flex items-center        
  justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                              <Bot className="w-4 h-4" />
                                          </div>
                                          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3        
  rounded-2xl">
                                              <div className="flex gap-1">
                                                  <span className="w-2 h-2 bg-gray-400 rounded-full     
  animate-bounce" />
                                                  <span className="w-2 h-2 bg-gray-400 rounded-full     
  animate-bounce [animation-delay:0.1s]" />
                                                  <span className="w-2 h-2 bg-gray-400 rounded-full     
  animate-bounce [animation-delay:0.2s]" />
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              )}
                              <div ref={messagesEndRef} />
                          </div>

                          {/* Input */}
                          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
  className="flex gap-2">
                                  <Input
                                      value={input}
                                      onChange={(e) => setInput(e.target.value)}
                                      placeholder="Ask me anything..."
                                      className="flex-1"
                                      disabled={isLoading}
                                  />
                                  <Button type="submit" size="icon" disabled={isLoading ||
  !input.trim()}>
                                      <Send className="w-4 h-4" />
                                  </Button>
                              </form>
                          </div>
                      </motion.div>
                  )}
              </AnimatePresence>
          </>
      );
  }
