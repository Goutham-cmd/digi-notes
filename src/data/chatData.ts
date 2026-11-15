import { ChatChannel, ChatMessage } from '@/types';

export const initialChatChannels: ChatChannel[] = [
  {
    id: 'general-campus',
    name: 'general-campus',
    topic: 'University-wide study hacks, exam schedules, and academic discussions',
    iconName: 'MessageSquare',
    onlineCount: 42,
  },
  {
    id: 'data-structures-dsa',
    name: 'data-structures-dsa',
    topic: 'Trees, Graphs, Dijkstra, DP, and asymptotic complexity problem solving',
    iconName: 'GitBranch',
    onlineCount: 28,
    unreadCount: 2,
  },
  {
    id: 'operating-systems',
    name: 'operating-systems',
    topic: 'Kernel architecture, virtual memory, paging algorithms, and deadlocks',
    iconName: 'Terminal',
    onlineCount: 19,
  },
  {
    id: 'web-cloud-devops',
    name: 'web-cloud-devops',
    topic: 'Next.js 15, Docker containers, Kubernetes clusters, and cloud labs',
    iconName: 'Cloud',
    onlineCount: 31,
  },
  {
    id: 'exam-prep-doubts',
    name: 'exam-prep-doubts',
    topic: 'Midterm formula sheets, urgent doubt clearance, and worked questions',
    iconName: 'Flame',
    onlineCount: 56,
    unreadCount: 4,
  },
];

export const initialChatMessages: ChatMessage[] = [
  // General Campus Channel
  {
    id: 'msg-1',
    channelId: 'general-campus',
    senderName: 'Academic Community Lead',
    senderRole: 'ta',
    department: 'Engineering Faculty',
    content: 'Welcome to the NoteNest Study Lounge! 🎓 Use this space to team up with peers, solve tricky exam problems together, and share course notes.',
    timestamp: 'Today at 10:15 AM',
    reactions: [
      { emoji: '👋', count: 18, userReacted: true },
      { emoji: '💡', count: 12 },
      { emoji: '🔥', count: 9 },
    ],
  },
  {
    id: 'msg-2',
    channelId: 'general-campus',
    senderName: 'Sarah K. (Senior Peer)',
    senderRole: 'student',
    department: 'Computer Science',
    content: 'Pro-tip for everyone taking Midterms next week: Check out the formula cheat sheets in the Explore tab. The Operating Systems summary saved me 4 hours of revision yesterday!',
    timestamp: 'Today at 11:30 AM',
    reactions: [
      { emoji: '❤️', count: 14, userReacted: false },
      { emoji: '💯', count: 8 },
    ],
  },

  // DSA Channel
  {
    id: 'msg-3',
    channelId: 'data-structures-dsa',
    senderName: 'Algorithms TA',
    senderRole: 'ta',
    department: 'Computer Science',
    content: 'Heads up for CS204 students: When implementing Dijkstra algorithm with negative edge weights, remember that Dijkstra fails! You must use Bellman-Ford algorithm instead which handles negative cycles in O(V * E) time.',
    timestamp: 'Today at 1:45 PM',
    attachedNoteId: 'note-1',
    attachedNoteTitle: 'Data Structures & Algorithms: Complete Graph Theory & Trees Master Notes',
    reactions: [
      { emoji: '💡', count: 24, userReacted: true },
      { emoji: '🎓', count: 15 },
    ],
  },
  {
    id: 'msg-4',
    channelId: 'data-structures-dsa',
    senderName: 'Marcus T. (Junior)',
    senderRole: 'student',
    department: 'Software Engineering',
    content: 'Can someone verify the worst-case lookup time for Red-Black trees versus AVL trees? Are AVL trees strictly faster for read-heavy workloads?',
    timestamp: 'Today at 2:10 PM',
    reactions: [
      { emoji: '🤔', count: 4 },
    ],
  },
  {
    id: 'msg-5',
    channelId: 'data-structures-dsa',
    senderName: 'Algorithms TA',
    senderRole: 'ta',
    department: 'Computer Science',
    content: 'Great question Marcus! Yes — AVL trees are more rigidly balanced (balance factor -1, 0, 1), leading to slightly faster O(log n) lookups. Red-Black trees require fewer rotations during insertions/deletions, making them preferred in standard library map implementations.',
    timestamp: 'Today at 2:14 PM',
    reactions: [
      { emoji: '🙌', count: 11, userReacted: true },
      { emoji: '💡', count: 7 },
    ],
  },

  // Operating Systems Channel
  {
    id: 'msg-6',
    channelId: 'operating-systems',
    senderName: 'Systems Peer Reviewer',
    senderRole: 'student',
    department: 'Computer Science',
    content: 'For the virtual memory lab: remember that in 32-bit architecture with 4KB page sizes, page tables require 2^20 entries (1,048,576 pages). Multi-level paging solves this by allowing pages of the page table itself to be paged out!',
    timestamp: 'Today at 3:20 PM',
    attachedNoteId: 'note-2',
    attachedNoteTitle: 'Operating Systems: Concurrency, Deadlocks & Virtual Memory Cheat Sheet',
    reactions: [
      { emoji: '🔥', count: 19 },
      { emoji: '💡', count: 14, userReacted: true },
    ],
  },

  // Cloud & DevOps Channel
  {
    id: 'msg-7',
    channelId: 'web-cloud-devops',
    senderName: 'DevOps Lab Mentor',
    senderRole: 'ta',
    department: 'Information Technology',
    content: 'Check out the new Docker & Kubernetes Architecture Slides in the repository! We included interactive ASCII diagrams for ingress controllers and pod lifecycle probes.',
    timestamp: 'Today at 4:05 PM',
    attachedNoteId: 'note-9',
    attachedNoteTitle: 'DevOps & Cloud Architecture: Kubernetes, Docker & CI/CD Pipelines Master Slides',
    reactions: [
      { emoji: '🚀', count: 21, userReacted: true },
      { emoji: '⭐', count: 16 },
    ],
  },

  // Exam Prep Doubts Channel
  {
    id: 'msg-8',
    channelId: 'exam-prep-doubts',
    senderName: 'Elena R. (TA)',
    senderRole: 'ta',
    department: 'Electrical Engineering',
    content: 'Drop your urgent midterm questions here! Moderating faculty and peer tutors are online for the next 2 hours for live doubt clearance.',
    timestamp: 'Today at 5:15 PM',
    reactions: [
      { emoji: '📚', count: 35, userReacted: true },
      { emoji: '⚡', count: 22 },
    ],
  },
];

