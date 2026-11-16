'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ChatChannel, ChatMessage } from '@/types';
import { initialChatChannels, initialChatMessages } from '@/data/chatData';
import {
  MessageSquare,
  GitBranch,
  Terminal,
  Cloud,
  Flame,
  Send,
  Paperclip,
  Smile,
  Hash,
  Users,
  Sparkles,
  BookOpen,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  Share2,
  FileText,
  Clock,
  Play,
} from 'lucide-react';

export default function ChatView() {
  const { userProfile, notes, openPreviewModal, addToast } = useApp();

  const [channels] = useState<ChatChannel[]>(initialChatChannels);
  const [activeChannelId, setActiveChannelId] = useState<string>('general-campus');
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputContent, setInputContent] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [showNotePicker, setShowNotePicker] = useState(false);
  const [isTypingPeer, setIsTypingPeer] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const channelMessages = messages.filter((m) => m.channelId === activeChannelId);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [channelMessages, isTypingPeer]);

  // Handle Channel Switch
  const handleSelectChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setShowNotePicker(false);
  };

  // Handle Message Submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() && !selectedNoteId) return;

    const attachedNote = notes.find((n) => n.id === selectedNoteId);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      senderName: userProfile.name || 'Student (You)',
      senderRole: (userProfile.role as any) === 'admin' ? 'admin' : 'student',
      department: userProfile.department || 'Computer Science',
      content: inputContent.trim(),
      timestamp: 'Just now',
      isCurrentUser: true,
      attachedNoteId: attachedNote?.id,
      attachedNoteTitle: attachedNote?.title,
      reactions: [],
    };

    setMessages((prev) => [...prev, newMsg]);
    const sentText = inputContent.trim();
    setInputContent('');
    setSelectedNoteId('');
    setShowNotePicker(false);

    // Simulate smart interactive peer answer if it looks like a question or study doubt
    if (sentText.includes('?') || sentText.length > 15 || attachedNote) {
      setIsTypingPeer(true);
      setTimeout(() => {
        setIsTypingPeer(false);
        let peerReply = '';
        let peerName = 'Algorithms TA';
        let peerDept = 'Computer Science';

        if (activeChannelId === 'operating-systems') {
          peerName = 'Systems Lab Lead';
          peerDept = 'Computer Systems';
          peerReply = `Great question on OS! Remember to double-check race conditions with semaphores vs spinlocks. Check the cheat sheet attached in the notes repository!`;
        } else if (activeChannelId === 'web-cloud-devops') {
          peerName = 'Cloud & DevOps TA';
          peerDept = 'Information Tech';
          peerReply = `Exactly! In Next.js 15 and Kubernetes, container probes ensure zero-downtime rolling upgrades. Review slide deck 4 for visual pod states!`;
        } else if (activeChannelId === 'exam-prep-doubts') {
          peerName = 'Exam Prep Mentor';
          peerDept = 'Academic Tutoring';
          peerReply = `That concept frequently appears in Section B of university finals. Highlight the edge cases and proof constraints in your revision notes!`;
        } else {
          peerName = 'Study Group Peer';
          peerDept = userProfile.department || 'Computer Science';
          peerReply = `Thanks for sharing this in #${activeChannel.name}! This is super helpful for our study group review session tonight.`;
        }

        const autoMsg: ChatMessage = {
          id: `msg-peer-${Date.now()}`,
          channelId: activeChannelId,
          senderName: peerName,
          senderRole: 'ta',
          department: peerDept,
          content: peerReply,
          timestamp: 'Just now',
          reactions: [{ emoji: '💡', count: 3, userReacted: true }],
        };

        setMessages((prev) => [...prev, autoMsg]);
      }, 1600);
    }
  };

  // Toggle emoji reactions
  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const currentReactions = msg.reactions || [];
        const existing = currentReactions.find((r) => r.emoji === emoji);

        if (existing) {
          if (existing.userReacted) {
            // Remove user reaction
            return {
              ...msg,
              reactions: currentReactions
                .map((r) =>
                  r.emoji === emoji ? { ...r, count: r.count - 1, userReacted: false } : r
                )
                .filter((r) => r.count > 0),
            };
          } else {
            // Add user reaction
            return {
              ...msg,
              reactions: currentReactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1, userReacted: true } : r
              ),
            };
          }
        } else {
          // New emoji reaction
          return {
            ...msg,
            reactions: [...currentReactions, { emoji, count: 1, userReacted: true }],
          };
        }
      })
    );
  };

  const getChannelIcon = (iconName: string) => {
    switch (iconName) {
      case 'GitBranch':
        return <GitBranch className="w-4 h-4 text-emerald-500" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4 text-blue-500" />;
      case 'Cloud':
        return <Cloud className="w-4 h-4 text-cyan-500" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-rose-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
    }
  };

  const quickPrompts = [
    'Can someone explain LRU Page Replacement algorithm steps?',
    'What is the difference between Dijkstra and Bellman-Ford?',
    'Does anyone have worked solutions for Midterm 2?',
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col lg:flex-row h-[78vh] min-h-[580px]">
      {/* -------------------------------------------------------------
          Left Sidebar: Study Channels
         ------------------------------------------------------------- */}
      <div className="w-full lg:w-72 bg-slate-50/70 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0">
        {/* Channel Header */}
        <div className="p-4 border-b border-slate-200 bg-white/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Study Channels</h3>
              <p className="text-[10px] text-slate-400">Collaborative Peer Rooms</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        {/* Channel List: Horizontal scroll on mobile, vertical on desktop */}
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto p-2 lg:p-3 space-x-1.5 lg:space-x-0 lg:space-y-1 scrollbar-none shrink-0">
          {channels.map((chan) => {
            const isActive = chan.id === activeChannelId;
            return (
              <button
                key={chan.id}
                onClick={() => handleSelectChannel(chan.id)}
                className={`flex items-center justify-between p-2 lg:p-2.5 rounded-xl text-left transition-all shrink-0 w-auto lg:w-full ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 bg-white lg:bg-transparent border border-slate-200 lg:border-0 hover:bg-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2 lg:gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 lg:w-7 lg:h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 lg:bg-white border border-slate-200/80'
                    }`}
                  >
                    <Hash className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate leading-snug">#{chan.name}</p>
                    <p
                      className={`text-[10px] truncate hidden sm:block ${
                        isActive ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      {chan.topic}
                    </p>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-1.5 shrink-0 ml-2">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isActive
                        ? 'bg-indigo-700/60 text-indigo-100'
                        : 'bg-slate-200/80 text-slate-500'
                    }`}
                  >
                    <Users className="w-2.5 h-2.5" />
                    {chan.onlineCount}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Study Integrity Disclaimer */}
        <div className="p-3 bg-slate-100/60 border-t border-slate-200/80 text-[10px] text-slate-400 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>NoteNest Academic Code: Be respectful & supportive!</span>
        </div>
      </div>

      {/* -------------------------------------------------------------
          Right Pane: Active Channel Chat & Feed
         ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        {/* Chat Room Top Bar */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              {getChannelIcon(activeChannel.iconName)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                  #{activeChannel.name}
                </h4>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  {activeChannel.onlineCount} students active
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">{activeChannel.topic}</p>
            </div>
          </div>

          {/* Quick Share Note Button */}
          <button
            onClick={() => setShowNotePicker((prev) => !prev)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200/80 transition-all cursor-pointer shrink-0"
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Share a Note</span>
          </button>
        </div>

        {/* Note Attachment Dropdown Picker */}
        {showNotePicker && (
          <div className="p-3 bg-indigo-50/70 border-b border-indigo-100 animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                Select a Study Note to share in #{activeChannel.name}:
              </span>
              <button
                onClick={() => setShowNotePicker(false)}
                className="text-xs text-indigo-500 hover:text-indigo-700"
              >
                Cancel
              </button>
            </div>
            <select
              value={selectedNoteId}
              onChange={(e) => setSelectedNoteId(e.target.value)}
              className="w-full text-xs p-2 bg-white border border-indigo-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">-- Choose a study guide from catalog --</option>
              {notes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.courseCode} — {n.title} ({n.fileType})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {channelMessages.map((msg) => {
            const isMe = msg.isCurrentUser;
            const attached = msg.attachedNoteId
              ? notes.find((n) => n.id === msg.attachedNoteId)
              : null;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 group transition-all ${isMe ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isMe
                      ? 'bg-indigo-600 text-white'
                      : msg.senderRole === 'ta'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {isMe ? 'ME' : msg.senderName.charAt(0)}
                </div>

                {/* Message Body */}
                <div className={`max-w-xl flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Sender Metadata */}
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-900">{msg.senderName}</span>
                    {msg.senderRole === 'ta' && (
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200 text-[9px]">
                        PEER TA
                      </span>
                    )}
                    {msg.department && <span>• {msg.department}</span>}
                    <span>• {msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Embedded Shared Note Card */}
                    {attached && (
                      <div
                        onClick={() => openPreviewModal(attached)}
                        className={`mt-2.5 p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isMe
                            ? 'bg-indigo-700/80 border-indigo-500 hover:bg-indigo-700 text-white'
                            : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isMe ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono font-semibold text-indigo-300">
                              {attached.courseCode}
                            </span>
                            <h5 className="text-xs font-semibold truncate leading-tight">
                              {attached.title}
                            </h5>
                          </div>
                        </div>

                        <span className="text-[11px] underline font-medium shrink-0 flex items-center gap-1">
                          Preview <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Emoji Reactions Tray */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    {msg.reactions?.map((rx, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleToggleReaction(msg.id, rx.emoji)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors cursor-pointer ${
                          rx.userReacted
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{rx.emoji}</span>
                        <span>{rx.count}</span>
                      </button>
                    ))}

                    {/* Quick Add Reaction Buttons */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-1">
                      {['👍', '💡', '🔥', '🎓'].map((emo) => (
                        <button
                          key={emo}
                          onClick={() => handleToggleReaction(msg.id, emo)}
                          className="hover:scale-125 transition-transform text-xs p-0.5"
                          title={`React with ${emo}`}
                        >
                          {emo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Peer Typing Indicator */}
          {isTypingPeer && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>A peer tutor is typing an answer...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompt Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Quick questions:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setInputContent(p)}
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 rounded-lg transition-colors truncate max-w-[280px]"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white">
          {selectedNoteId && (
            <div className="mb-2 p-2 bg-indigo-50 text-indigo-700 text-xs rounded-lg border border-indigo-200/80 flex items-center justify-between">
              <span className="flex items-center gap-1.5 truncate">
                <Paperclip className="w-3.5 h-3.5" />
                Attached: {notes.find((n) => n.id === selectedNoteId)?.title}
              </span>
              <button
                type="button"
                onClick={() => setSelectedNoteId('')}
                className="text-xs font-bold hover:text-rose-600 ml-2"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNotePicker((prev) => !prev)}
              className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
              title="Attach study note from catalog"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder={`Message #${activeChannel.name} (ask questions, share insights)...`}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />

            <button
              type="submit"
              disabled={!inputContent.trim() && !selectedNoteId}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

