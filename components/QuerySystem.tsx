
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, X, Image as ImageIcon, Loader2, Sparkles, Wand2, MicOff, AlertCircle, Eye } from 'lucide-react';
import { generateTextResponse, editImageWithGemini, generateClassroomImage } from '../services/geminiService';
import { ChatMessage, UserProfile } from '../types';

interface QuerySystemProps {
  onClose: () => void;
  user: UserProfile;
  onActivity: () => void;
}

type Mode = 'CHAT' | 'IMAGE_EDIT';

export const QuerySystem: React.FC<QuerySystemProps> = ({ onClose, user, onActivity }) => {
  const [mode, setMode] = useState<Mode>('CHAT');
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: `Namaste ${user.name || "Teacher"}! 🙏\nI am ready to help. Ask me about your lesson plan, or say "Give me an activity for Class ${user.grade || '1'}"` }
  ]);

  // Image Edit State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setSpeechError(null);
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      // Abort any existing session
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN'; // Default to Indian English

      // Capture the current input to append to it
      const baseInput = input;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Combine base input with the accumulated transcript from this session
        const currentTranscript = finalTranscript + interimTranscript;
        const separator = baseInput && !baseInput.endsWith(' ') ? ' ' : '';
        setInput(baseInput + separator + currentTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'no-speech') {
            return;
        }
        
        setIsListening(false);
        let msg = "Voice input failed.";
        
        if (event.error === 'network') {
            msg = "Network error: Check connection.";
        } else if (event.error === 'not-allowed') {
            msg = "Microphone denied. Enable permissions.";
        }
        
        setSpeechError(msg);
        setTimeout(() => setSpeechError(null), 4000);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start speech recognition", e);
        setIsListening(false);
      }
    } else {
      setSpeechError("Voice input not supported in this browser.");
      setTimeout(() => setSpeechError(null), 4000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;
    
    // Track stat
    onActivity();

    if (mode === 'CHAT') {
      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
      const currentHistory = messages; // Capture history before state update
      
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsProcessing(true);

      // Pass the full user object and history for context
      const responseText = await generateTextResponse(input, user, currentHistory);
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText }]);
      setIsProcessing(false);
    } else {
      // Image Edit Mode
      if (!selectedImage || !input) return;
      
      setIsProcessing(true);
      // Clean base64 string
      const base64Data = selectedImage.split(',')[1]; 
      
      try {
        const resultBase64 = await editImageWithGemini(base64Data, input);
        if (resultBase64) {
          setEditedImage(`data:image/jpeg;base64,${resultBase64}`);
        } else {
            alert("Could not edit image. Please try again.");
        }
      } catch (e) {
        console.error(e);
        alert("Error processing image.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleVisualize = async (messageId: string, text: string) => {
    // 1. Set loading state for this specific message
    setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isGeneratingImage: true } : msg
    ));

    // 2. Call API with "English" explicitly
    const imageBase64 = await generateClassroomImage(text, "English");

    // 3. Update message with image or error, remove loading
    setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { 
            ...msg, 
            isGeneratingImage: false, 
            image: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : undefined 
        } : msg
    ));
    
    if (!imageBase64) {
        setSpeechError("Could not generate image. Try again.");
        setTimeout(() => setSpeechError(null), 3000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setEditedImage(null); // Reset previous edits
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex gap-2">
            <button 
                onClick={() => setMode('CHAT')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${mode === 'CHAT' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-100 text-gray-600'}`}
            >
                Teacher Chat
            </button>
            <button 
                onClick={() => setMode('IMAGE_EDIT')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-1 ${mode === 'IMAGE_EDIT' ? 'bg-secondary text-white shadow-lg shadow-secondary/30' : 'bg-gray-100 text-gray-600'}`}
            >
                <Wand2 className="w-3 h-3" /> Magic Editor
            </button>
        </div>
        <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        {mode === 'CHAT' ? (
          <div className="space-y-4 pb-20">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl relative shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-white border border-gray-100 text-dark rounded-bl-none'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                  
                  {/* Generated Image */}
                  {msg.image && (
                      <div className="mt-3 rounded-xl overflow-hidden border-2 border-secondary shadow-sm">
                          <img src={msg.image} alt="Visual Aid" className="w-full h-auto" />
                      </div>
                  )}

                  {/* Loading Spinner for Image */}
                  {msg.isGeneratingImage && (
                      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-secondary bg-secondary/10 p-3 rounded-xl animate-pulse">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating visual aid...
                      </div>
                  )}

                </div>
                
                {/* Visualize Button (Only for Model, only if no image yet, and not loading) */}
                {msg.role === 'model' && !msg.image && !msg.isGeneratingImage && (
                    <button 
                        onClick={() => handleVisualize(msg.id, msg.text || "")}
                        className="mt-2 group relative overflow-hidden bg-white text-secondary border border-secondary/20 px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 text-[10px] font-bold active:scale-95 ml-1"
                    >
                        <Sparkles className="w-3 h-3 text-secondary animate-pulse" />
                        <span>Visualize Concept</span>
                    </button>
                )}
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center h-full space-y-6">
            <div className="w-full bg-white rounded-2xl border-2 border-dashed border-gray-300 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden hover:border-secondary transition-colors group">
                {!selectedImage ? (
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/10 transition-colors">
                            <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-secondary" />
                        </div>
                        <p className="text-gray-600 font-bold mb-1">Upload Classroom Photo</p>
                        <p className="text-xs text-gray-400 mb-4">We will use AI to edit it for you.</p>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-dark text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-dark/20 hover:bg-gray-800 transition-colors"
                        >
                            Select Image
                        </button>
                    </div>
                ) : (
                    <>
                        {isProcessing ? (
                             <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                                <Sparkles className="w-10 h-10 text-secondary animate-spin mb-3" />
                                <p className="text-secondary font-bold animate-pulse">Magic in progress...</p>
                             </div>
                        ) : null}
                        
                        {editedImage ? (
                            <div className="relative w-full h-full">
                                <img src={editedImage} alt="Edited" className="w-full h-full object-contain" />
                                <button 
                                    onClick={() => setEditedImage(null)}
                                    className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md"
                                >
                                    Show Original
                                </button>
                            </div>
                        ) : (
                            <img src={selectedImage} alt="Original" className="w-full h-full object-contain" />
                        )}

                        {/* Reset Button */}
                        <button 
                           onClick={() => { setSelectedImage(null); setEditedImage(null); }}
                           className="absolute top-2 left-2 bg-white/90 p-2 rounded-full text-gray-600 shadow-sm hover:text-red-500"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
            
            {selectedImage && !editedImage && (
                <div className="w-full text-center animate-in slide-in-from-bottom-5">
                    <p className="text-sm font-bold text-gray-600 mb-3">What should I change?</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {["Remove background", "Add a retro filter", "Make it brighter", "Add a whiteboard"].map(suggestion => (
                            <button 
                                key={suggestion}
                                onClick={() => setInput(suggestion)}
                                className="bg-white border border-gray-200 px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:border-secondary hover:text-secondary transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        )}
        
        {/* Error Toast */}
        {speechError && (
            <div className="fixed bottom-24 left-4 right-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-3 shadow-lg border border-red-100 animate-in slide-in-from-bottom-5 z-50">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{speechError}</span>
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 pb-8 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
            {mode === 'CHAT' && (
                <button 
                    onClick={toggleListening}
                    className={`h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
                        isListening 
                            ? 'bg-red-500 text-white animate-pulse shadow-red-200 shadow-xl' 
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    }`}
                >
                    {isListening ? <div className="flex gap-0.5 h-4 items-end">
                        <div className="w-1 bg-white animate-[bounce_1s_infinite] h-full"></div>
                        <div className="w-1 bg-white animate-[bounce_1.2s_infinite] h-3"></div>
                        <div className="w-1 bg-white animate-[bounce_0.8s_infinite] h-full"></div>
                    </div> : <Mic className="w-5 h-5" />}
                </button>
            )}
            
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? "Listening..." : (mode === 'CHAT' ? "Ask anything..." : "Describe the edit...")}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-5 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none pr-10 text-gray-900 placeholder:text-gray-400 font-medium transition-all"
                />
            </div>

            <button 
                onClick={handleSend}
                disabled={isProcessing || (!input && !selectedImage)}
                className={`h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
                    input || selectedImage ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-100' : 'bg-gray-100 text-gray-300 scale-95'
                }`}
            >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
        </div>
      </div>
    </div>
  );
};
