import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendChatMessage } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Hello! I'm your PCOS AI companion. I can answer questions about PCOS symptoms, diet, exercise, hormones, and lifestyle changes. What would you like to know?",
  suggestions: ["What diet is best for PCOS?", "How does exercise help with PCOS?", "What are the main symptoms?"],
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendMessage = useSendChatMessage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(text?: string) {
    const messageText = text ?? input.trim();
    if (!messageText) return;

    const userMsg: Message = { role: "user", content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    const history = messages.map(m => ({ role: m.role, content: m.content }));

    sendMessage.mutate(
      { data: { message: messageText, conversationHistory: history } },
      {
        onSuccess: (res) => {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: res.message,
            suggestions: res.suggestions,
          }]);
        },
        onError: () => {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: "I'm having trouble responding right now. Please try again.",
          }]);
        },
      }
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] p-4 md:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI Chatbot</h1>
        <p className="text-muted-foreground text-sm mt-1">Ask me anything about PCOS, diet, and wellness</p>
      </div>

      {/* Messages */}
      <Card className="flex-1 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "assistant" ? "bg-primary/10 text-primary" : "bg-accent/60 text-foreground"
                }`}>
                  {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "assistant"
                      ? "bg-muted/60 text-foreground rounded-tl-none"
                      : "bg-primary text-primary-foreground rounded-tr-none"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestions.map((s, si) => (
                        <button key={si} onClick={() => send(s)}>
                          <Badge variant="outline" className="cursor-pointer rounded-full text-xs hover:bg-primary/10 transition-colors">
                            {s}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {sendMessage.isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted/60 px-4 py-3 rounded-2xl rounded-tl-none">
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask about PCOS, diet, symptoms..."
              className="rounded-2xl flex-1"
              disabled={sendMessage.isPending}
              data-testid="input-message"
            />
            <Button
              onClick={() => send()}
              disabled={!input.trim() || sendMessage.isPending}
              className="rounded-2xl px-4"
              data-testid="button-send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            This chatbot provides general information only, not medical advice.
          </p>
        </div>
      </Card>
    </div>
  );
}
