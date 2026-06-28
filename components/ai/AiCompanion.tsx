"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  MessageSquare,
  Send,
  Trash2,
  Plus,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  Bot,
  User,
  FileText,
  HelpCircle,
  Sidebar as SidebarIcon,
  X,
  Paperclip,
  Maximize2,
  FileSpreadsheet,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  createConversationAction,
  deleteConversationAction,
  getConversationsAction,
  getMessagesAction,
} from "@/app/actions/ai";

interface AiCompanionProps {
  batchId: string;
  batchName: string;
  userId: string;
  variant: "student" | "admin";
  initialConversations: any[];
  notes: any[];
  summaries: any[];
  doubts: any[];
}

export function AiCompanion({
  batchId,
  batchName,
  userId,
  variant,
  initialConversations,
  notes,
  summaries,
  doubts,
}: AiCompanionProps) {
  const [conversations, setConversations] = useState<any[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "summaries" | "doubts">(
    variant === "admin" ? "notes" : "notes"
  );

  // Attachment States
  const [selectedContexts, setSelectedContexts] = useState<any[]>([]);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // UI Panels Toggle (Default: open on desktop, closed on mobile)
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

  // Accordion Expand/Collapse States in Context Panel
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Lightbox Modal Image State
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container width with ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.unobserve(container);
    };
  }, []);

  // Switch to mobile layout overlay style if container width is below 780px
  const isCompactLayout = containerWidth > 0 && containerWidth < 780;

  // Set default panel visibility based on container width
  useEffect(() => {
    if (containerWidth > 0) {
      if (containerWidth < 780) {
        setIsLeftOpen(false);
        setIsRightOpen(false);
      } else {
        setIsLeftOpen(true);
        setIsRightOpen(true);
      }
    }
  }, [containerWidth]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load message history
  useEffect(() => {
    if (activeConvId) {
      const loadMessages = async () => {
        try {
          const fetchedMessages = await getMessagesAction(activeConvId);
          setMessages(fetchedMessages);
        } catch (e) {
          console.error("Failed to load messages:", e);
        }
      };
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [activeConvId]);

  // Helper to convert base64 dataURL to Blob for R2 uploads
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Helper to parse basic markdown bold (**text**) and bullet lists
  const renderFormattedAnswer = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      const bulletMatch = line.match(/^[-*•]\s+(.*)$/);

      const parseBold = (str: string) => {
        const parts = str.split(/\*\*([^*]+)\*\*/g);
        return parts.map((part, idx) => {
          if (idx % 2 === 1) {
            return (
              <strong key={idx} className="font-bold text-slate-900">
                {part}
              </strong>
            );
          }
          return part;
        });
      };

      if (bulletMatch) {
        return (
          <div key={lineIdx} className="flex items-start gap-1.5 ml-2 my-1">
            <span className="text-violet-500 mt-1 select-none">•</span>
            <span className="flex-1 text-slate-700">{parseBold(bulletMatch[1])}</span>
          </div>
        );
      }

      return (
        <div key={lineIdx} className={line.trim() === "" ? "h-2" : "my-0.5 text-slate-700"}>
          {parseBold(line)}
        </div>
      );
    });
  };

  // Handle Ctrl+V paste from clipboard
  const handlePaste = (e: React.ClipboardEvent) => {
    const file = e.clipboardData.files?.[0];
    if (file && file.type.startsWith("image/")) {
      e.preventDefault();
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle File upload selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachedImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Context item attachment logic
  const handleAttachContext = (item: { id: string; type: string; title: string }) => {
    const exists = selectedContexts.some((c) => c.id === item.id && c.type === item.type);
    if (!exists) {
      setSelectedContexts((prev) => [...prev, item]);
    }
  };

  // Remove context attachment
  const handleRemoveContext = (id: string) => {
    setSelectedContexts((prev) => prev.filter((c) => c.id !== id));
  };

  // Toggle Context Card Expand in panel
  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent attaching when clicking chevron
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Suggestion click handler to populate text box
  const handleContextQuery = (text: string) => {
    setInputText((prev) => (prev ? prev + "\n" + text : text));
  };

  // Create new chat
  const handleNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
    setInputText("");
    setSelectedContexts([]);
    setAttachedImages([]);
    if (window.innerWidth < 768) {
      setIsLeftOpen(false);
    }
  };

  // Delete chat
  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteConversationAction(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConvId === id) {
        setActiveConvId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  // Submit messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && attachedImages.length === 0) || isStreaming) return;

    const messageText = inputText;
    const contextsToSend = [...selectedContexts];
    const imagesToSend = [...attachedImages];

    setInputText("");
    setSelectedContexts([]);
    setAttachedImages([]);
    setIsStreaming(true);

    try {
      let currentConvId = activeConvId;

      // 1. Upload attached images to Cloudflare Worker R2 if present
      let uploadedImageUrls: string[] = [];
      if (imagesToSend.length > 0) {
        setIsUploading(true);
        try {
          const SYNC_WORKER_URL = (
            process.env.NEXT_PUBLIC_SYNC_WORKER_URL ||
            "https://opengrapes-whiteboard-sync.manasrikhari23.workers.dev"
          ).replace(/\/+$/, "");

          uploadedImageUrls = await Promise.all(
            imagesToSend.map(async (imgBase64) => {
              if (imgBase64.startsWith("http")) return imgBase64;

              const uploadId = `${crypto.randomUUID()}-ai-upload.jpg`;
              const uploadUrl = `${SYNC_WORKER_URL}/api/uploads/${uploadId}`;
              const blob = dataURLtoBlob(imgBase64);

              const uploadRes = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": blob.type },
                body: blob,
              });

              if (!uploadRes.ok) {
                throw new Error(`R2 upload failed: ${uploadRes.status}`);
              }
              return uploadUrl;
            })
          );
        } catch (uploadErr) {
          console.error("R2 upload error inside LMS AI Companion:", uploadErr);
          uploadedImageUrls = imagesToSend; // fallback to raw base64
        } finally {
          setIsUploading(false);
        }
      }

      // 2. Format query payload (Option A - JSON serialization)
      const messagePayload = JSON.stringify({
        text: messageText,
        attachments: contextsToSend,
        images: uploadedImageUrls,
      });

      // 3. Create conversation thread if not already active
      if (!currentConvId) {
        // Render user message instantly in client
        setMessages([{ id: "temp-user", role: "user", content: messagePayload }]);

        const newId = await createConversationAction(batchId, messagePayload);
        currentConvId = newId;
        setActiveConvId(newId);

        const refreshedConvs = await getConversationsAction(batchId);
        setConversations(refreshedConvs);
      } else {
        setMessages((prev) => [...prev, { id: "temp-user", role: "user", content: messagePayload }]);
      }

      // 4. Hit streaming Route Handler
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: currentConvId,
          message: messagePayload,
        }),
      });

      if (!response.ok) {
        throw new Error("Route Handler returned error response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let streamedResponse = "";

      // Replace temp user message with final messages array structures
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "temp-user"),
        { id: "saved-user", role: "user", content: messagePayload },
        { id: "temp-model", role: "model", content: "" },
      ]);

      if (reader) {
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: !done });
            streamedResponse += chunk;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === "temp-model" ? { ...msg, content: streamedResponse } : msg
              )
            );
          }
        }
      }

      // Sync finalized message IDs from database
      const finalMessages = await getMessagesAction(currentConvId);
      setMessages(finalMessages);

      // Refresh sidebar list
      const refreshedConvs = await getConversationsAction(batchId);
      setConversations(refreshedConvs);
    } catch (err) {
      console.error("AI chat error:", err);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "temp-model"),
        {
          id: "error-msg",
          role: "model",
          content: "Sorry, I had trouble generating a response. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  // Helper to check and render message bubbles
  const renderMessageBubble = (m: any) => {
    const isUser = m.role === "user";

    // Handle Option A - JSON string parsing
    if (isUser && m.content.startsWith("{")) {
      try {
        const { text, attachments, image, images } = JSON.parse(m.content);
        const imgs = images || (image ? [image] : []);
        return (
          <div className="space-y-2">
            {/* Visual Context Attachments */}
            {attachments && attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pb-1">
                {attachments.map((att: any, idx: number) => {
                  let Icon = FileText;
                  if (att.type === "doubt") Icon = Clock;
                  if (att.type === "summary") Icon = HelpCircle;

                  return (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-violet-100 bg-white/95 text-[10px] font-medium text-violet-800 shadow-sm"
                    >
                      <Icon className="size-3 text-violet-500 shrink-0" />
                      <span className="max-w-[120px] truncate">{att.title}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Attached Images Grid */}
            {imgs && imgs.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-1.5">
                {imgs.map((imgUrl: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedLightboxImage(imgUrl)}
                    className="relative group w-36 aspect-video rounded-lg overflow-hidden border border-white/40 cursor-pointer shadow-md"
                  >
                    <img
                      src={imgUrl}
                      alt={`Student Upload ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Message query text */}
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{text}</div>
          </div>
        );
      } catch (e) {
        // Fallback to plain text if JSON parsing fails
      }
    }

    return (
      <div className="text-sm leading-relaxed space-y-1">
        {isUser ? m.content : renderFormattedAnswer(m.content)}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative flex h-[calc(100vh-8rem)] w-full overflow-hidden rounded-2xl border border-violet-100/60 bg-white/70 shadow-sm shadow-violet-100/60 backdrop-blur-sm">
      
      {/* 1. Left Sidebar: Chat History */}
      {/* Mobile backdrop mask */}
      {isCompactLayout && isLeftOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40"
          onClick={() => setIsLeftOpen(false)}
        />
      )}
      <div
        className={
          isCompactLayout
            ? `absolute inset-y-0 left-0 z-50 flex shrink-0 flex-col bg-slate-50/95 shadow-2xl transition-all duration-300 overflow-hidden ${
                isLeftOpen
                  ? "w-64 translate-x-0 opacity-100 border-r border-violet-100/40"
                  : "w-0 -translate-x-full opacity-0 pointer-events-none border-r-0 border-transparent"
              }`
            : `static flex shrink-0 flex-col bg-slate-50/50 transition-all duration-300 overflow-hidden ${
                isLeftOpen
                  ? "w-64 translate-x-0 opacity-100 border-r border-violet-100/40"
                  : "w-0 opacity-0 pointer-events-none border-r-0 border-transparent"
              }`
        }
      >
        <div className="p-4 border-b border-violet-100/30 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chat Threads</span>
          <Button variant="secondary" size="sm" onClick={handleNewChat} className="px-2 py-1 gap-1">
            <Plus className="size-3.5" />
            New
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <p className="p-4 text-xs text-center text-slate-400">No past chats yet.</p>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setActiveConvId(c.id);
                  if (isCompactLayout) setIsLeftOpen(false);
                }}
                className={`group flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-150 cursor-pointer ${
                  activeConvId === c.id
                    ? "bg-violet-100/60 text-violet-800 font-medium"
                    : "text-slate-600 hover:bg-slate-100/50"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="size-4 shrink-0 text-violet-400" />
                  <span className="truncate">{c.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(e, c.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  title="Delete chat"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Middle Panel: Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white/40">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-violet-100/30 px-6 py-3 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLeftOpen(!isLeftOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              title="Toggle Sidebar"
            >
              <SidebarIcon className="size-4" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                {activeConvId
                  ? conversations.find((c) => c.id === activeConvId)?.title || "AI Companion"
                  : "New Conversation"}
              </h2>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{batchName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isRightOpen ? "secondary" : "outline"}
              size="sm"
              onClick={() => setIsRightOpen(!isRightOpen)}
              className="gap-1.5"
            >
              <BookOpen className="size-4" />
              <span className="hidden sm:inline">Context Panel</span>
            </Button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
              <div className="p-3 bg-violet-50 rounded-2xl border border-violet-100 animate-pulse text-violet-600">
                <Sparkles className="size-8" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg">Chat with OpenGrapes AI</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Ask doubts, summarize concepts, or request explanations based on your batch notes and classroom meetings!
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-4">
                <button
                  onClick={() => handleContextQuery("Explain the main concepts in the latest notes.")}
                  className="p-3 text-left border border-slate-150 rounded-xl text-xs hover:border-violet-300 hover:bg-violet-50/20 text-slate-600 transition-all cursor-pointer"
                >
                  📝 Summarize notes
                </button>
                <button
                  onClick={() => handleContextQuery("What are the key formulas or topics taught in recent live sessions?")}
                  className="p-3 text-left border border-slate-150 rounded-xl text-xs hover:border-violet-300 hover:bg-violet-50/20 text-slate-600 transition-all cursor-pointer"
                >
                  🎥 Review live classes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <div key={m.id || idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Avatar */}
                      <div
                        className={`size-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                          isUser ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-600 border border-violet-100"
                        }`}
                      >
                        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
                      </div>

                      {/* Message bubble */}
                      <div
                        className={`rounded-2xl p-4 shadow-sm ${
                          isUser
                            ? "bg-violet-600 text-white rounded-tr-none"
                            : "bg-white border border-violet-50 text-slate-800 rounded-tl-none"
                        }`}
                      >
                        {renderMessageBubble(m)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar with attachments region */}
        <div className="p-4 border-t border-violet-100/30 bg-white/50 backdrop-blur-sm">
          {/* Context Pills & Image attachment preview bar */}
          {(selectedContexts.length > 0 || attachedImages.length > 0) && (
            <div className="flex flex-wrap gap-2 pb-3 pt-1">
              
              {/* Selected Context Pills */}
              {selectedContexts.map((att) => {
                let Icon = FileText;
                if (att.type === "doubt") Icon = Clock;
                if (att.type === "summary") Icon = HelpCircle;

                return (
                  <div
                    key={`${att.type}-${att.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-100 bg-violet-50/50 text-xs font-medium text-violet-700 shadow-xs"
                  >
                    <Icon className="size-3.5 text-violet-500 shrink-0" />
                    <span className="max-w-[120px] truncate">{att.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveContext(att.id)}
                      className="ml-1 text-violet-400 hover:text-violet-600 hover:bg-violet-100/80 rounded-full p-0.5 transition-colors cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                );
              })}

              {/* Uploaded Image Thumbnail Previews */}
              {attachedImages.map((img, idx) => (
                <div key={idx} className="relative pt-1.5 pr-1.5 shrink-0">
                  <div
                    onClick={() => setSelectedLightboxImage(img)}
                    className="relative w-12 h-12 rounded-lg border border-violet-150 overflow-hidden shadow-xs cursor-pointer group"
                    title="Click to preview screenshot"
                  >
                    <img src={img} alt="Clipboard Paste" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Maximize2 className="size-3 text-white" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-0 right-0 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-0.5 shadow-sm transition-colors cursor-pointer z-10"
                    title="Remove image"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Prompt field */}
          <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
            {/* Hidden image upload input */}
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="p-2 rounded-xl border border-violet-100/60 bg-white/80 text-slate-500 hover:text-violet-600 hover:border-violet-300 transition-colors cursor-pointer shrink-0"
              title="Attach screenshot/image"
            >
              <Paperclip className="size-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPaste={handlePaste}
              placeholder="Type message, paste (Ctrl+V) image, or click attachments..."
              disabled={isStreaming}
              className="flex-1 rounded-xl border border-violet-100/60 bg-white/80 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:outline-none disabled:bg-slate-50"
            />
            <Button
              type="submit"
              disabled={(!inputText.trim() && attachedImages.length === 0) || isStreaming}
              loading={isUploading}
              className="rounded-xl px-4 py-2 shrink-0"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* 3. Right Sidebar: Collapsible Classroom Context */}
      {/* Mobile backdrop mask */}
      {isCompactLayout && isRightOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40"
          onClick={() => setIsRightOpen(false)}
        />
      )}
      <div
        className={
          isCompactLayout
            ? `absolute inset-y-0 right-0 z-50 flex shrink-0 flex-col bg-slate-50/95 shadow-2xl transition-all duration-300 overflow-hidden ${
                isRightOpen
                  ? "w-80 translate-x-0 opacity-100 border-l border-violet-100/40"
                  : "w-0 translate-x-full opacity-0 pointer-events-none border-l-0 border-transparent"
              }`
            : `static flex shrink-0 flex-col bg-slate-50/50 transition-all duration-300 overflow-hidden ${
                isRightOpen
                  ? "w-80 translate-x-0 opacity-100 border-l border-violet-100/40"
                  : "w-0 opacity-0 pointer-events-none border-l-0 border-transparent"
              }`
        }
      >
        {/* Sidebar Header/Tabs */}
        <div className="border-b border-violet-100/30 flex bg-white/60">
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-all cursor-pointer ${
              activeTab === "notes"
                ? "border-violet-600 text-violet-700 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab("summaries")}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-all cursor-pointer ${
              activeTab === "summaries"
                ? "border-violet-600 text-violet-700 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Summaries
          </button>
          <button
            onClick={() => setActiveTab("doubts")}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-all cursor-pointer ${
              activeTab === "doubts"
                ? "border-violet-600 text-violet-700 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            My Doubts
          </button>
        </div>

        {/* Tab Contents with Expanding accordion items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === "notes" && (
            <>
              {notes.length === 0 ? (
                <p className="text-xs text-center text-slate-400 py-6">No batch notes available yet.</p>
              ) : (
                notes.map((n) => {
                  const isExpanded = expandedItems[n.id];
                  return (
                    <Card
                      key={n.id}
                      onClick={() => setExpandedItems((prev) => ({ ...prev, [n.id]: !prev[n.id] }))}
                      className="p-3 border border-violet-100/50 bg-white hover:bg-violet-50/30 hover:border-violet-200 transition-all cursor-pointer select-none group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-violet-700">
                              {n.title}
                            </h4>
                            <p className="text-[9px] text-slate-400">{n.subject}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAttachContext({ id: n.id, type: "note", title: n.title });
                              }}
                              className="p-1 rounded-md hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-all cursor-pointer"
                              title="Attach as context"
                            >
                              <Plus className="size-3.5" />
                            </button>
                            <div className="text-slate-400 p-1">
                              {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                            </div>
                          </div>
                        </div>

                        {/* Collapsible content (scrollable container with max-height) */}
                        {isExpanded && (
                          <div className="max-h-36 overflow-y-auto mt-2 p-2 border border-slate-100 bg-slate-50/50 rounded-lg text-[10px] text-slate-600 leading-relaxed scrollbar-thin">
                            {n.content}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })
              )}
            </>
          )}

          {activeTab === "summaries" && (
            <>
              {summaries.length === 0 ? (
                <p className="text-xs text-center text-slate-400 py-6">No lesson summaries compiled yet.</p>
              ) : (
                summaries.map((s, idx) => {
                  const isExpanded = expandedItems[s.id];
                  const title = `Meeting Session ${idx + 1}`;
                  return (
                    <Card
                      key={s.id}
                      onClick={() => setExpandedItems((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                      className="p-3 border border-violet-100/50 bg-white hover:bg-violet-50/30 hover:border-violet-200 transition-all cursor-pointer select-none group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                            <FileText className="size-4 shrink-0 text-violet-400" />
                            <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-violet-700">
                              {title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAttachContext({ id: s.id, type: "summary", title });
                              }}
                              className="p-1 rounded-md hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-all cursor-pointer"
                              title="Attach as context"
                            >
                              <Plus className="size-3.5" />
                            </button>
                            <div className="text-slate-400 p-1">
                              {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                            </div>
                          </div>
                        </div>

                        {/* Collapsible content (scrollable container with max-height) */}
                        {isExpanded && (
                          <div className="max-h-36 overflow-y-auto mt-2 p-2 border border-slate-100 bg-slate-50/50 rounded-lg text-[10px] text-slate-600 leading-relaxed scrollbar-thin">
                            {s.content}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })
              )}
            </>
          )}

          {activeTab === "doubts" && (
            <>
              {doubts.length === 0 ? (
                <p className="text-xs text-center text-slate-400 py-6">No doubts asked in meetings yet.</p>
              ) : (
                doubts.map((d) => {
                  const isExpanded = expandedItems[d.id];
                  return (
                    <Card
                      key={d.id}
                      onClick={() => setExpandedItems((prev) => ({ ...prev, [d.id]: !prev[d.id] }))}
                      className="p-3 border border-violet-100/50 bg-white hover:bg-violet-50/30 hover:border-violet-200 transition-all cursor-pointer select-none group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 text-[9px] text-slate-450">
                              <Clock className="size-3 shrink-0 text-violet-400" />
                              <span>Solved Doubt</span>
                            </div>
                            <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-violet-700 mt-0.5">
                              {d.doubtText}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAttachContext({ id: d.id, type: "doubt", title: d.doubtText });
                              }}
                              className="p-1 rounded-md hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-all cursor-pointer"
                              title="Attach as context"
                            >
                              <Plus className="size-3.5" />
                            </button>
                            <div className="text-slate-400 p-1">
                              {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                            </div>
                          </div>
                        </div>

                        {/* Collapsible Answer & Screenshot (scrollable container with max-height) */}
                        {isExpanded && (
                          <div className="mt-2 space-y-2 p-2 border border-slate-100 bg-slate-50/50 rounded-lg text-[10px] text-slate-600 leading-relaxed">
                            <div>
                              <strong className="text-slate-700 font-semibold">Answer:</strong>
                              <p className="mt-0.5 line-clamp-4 overflow-y-auto scrollbar-thin">{d.answer}</p>
                            </div>
                            
                            {/* Display image thumbnail if doubt has screenshot */}
                            {d.screenshot && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation(); // prevent collapsing the card
                                  setSelectedLightboxImage(d.screenshot);
                                }}
                                className="relative group w-full aspect-video rounded-lg overflow-hidden border border-slate-200 cursor-pointer shadow-xs"
                              >
                                <img
                                  src={d.screenshot}
                                  alt="Doubt screenshot"
                                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Maximize2 className="size-3 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <Modal open={!!selectedLightboxImage} onClose={() => setSelectedLightboxImage(null)} title="Screenshot Preview">
        {selectedLightboxImage && (
          <div className="flex items-center justify-center bg-slate-900/10 p-2 rounded-xl">
            <img
              src={selectedLightboxImage}
              alt="Lightbox Screenshot"
              className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-lg"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
