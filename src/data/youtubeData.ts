export type YouTubeVideoType = 'all' | 'full-course' | 'crash-course' | 'concept-animation' | 'exam-problems';

export interface YouTubeVideo {
  id: string;
  subject: string;
  title: string;
  channel: string;
  channelAvatar?: string;
  youtubeUrl: string;
  youtubeId: string;
  type: 'full-course' | 'crash-course' | 'concept-animation' | 'exam-problems';
  typeLabel: string;
  duration: string;
  views: string;
  level: string;
  thumbnailUrl: string;
  description: string;
  keyTopics: string[];
}

export const youtubeCategories: { id: YouTubeVideoType; label: string; icon: string }[] = [
  { id: 'all', label: 'All Video Types', icon: 'Sparkles' },
  { id: 'full-course', label: '🎓 Full Courses & Playlists', icon: 'GraduationCap' },
  { id: 'crash-course', label: '⚡ Crash Courses (One-Shot)', icon: 'Zap' },
  { id: 'concept-animation', label: '✨ Visual Concept Animations', icon: 'PlayCircle' },
  { id: 'exam-problems', label: '📝 Exam Solved Numericals', icon: 'FileCheck' },
];

export const youtubeVideosCatalog: YouTubeVideo[] = [
  // -------------------------------------------------------------------------
  // 1. DATA STRUCTURES & ALGORITHMS
  // -------------------------------------------------------------------------
  {
    id: 'yt-dsa-1',
    subject: 'Data Structures & Algorithms',
    title: 'Data Structures Easy to Advanced Course - Full Tutorial from Google Engineer',
    channel: 'freeCodeCamp.org',
    youtubeId: 'RBSGKlAvoiM',
    youtubeUrl: 'https://www.youtube.com/watch?v=RBSGKlAvoiM',
    type: 'full-course',
    typeLabel: 'Full University Course',
    duration: '8h 03m',
    views: '4.8M views',
    level: 'Beginner to Advanced',
    thumbnailUrl: 'https://img.youtube.com/vi/RBSGKlAvoiM/hqdefault.jpg',
    description: 'Learn and master the most common data structures in this full course covering dynamic arrays, linked lists, stacks, queues, binary search trees, AVL trees, and graphs.',
    keyTopics: ['Arrays', 'Linked Lists', 'Binary Search Trees', 'Heaps', 'Union Find', 'Graph Theory'],
  },
  {
    id: 'yt-dsa-2',
    subject: 'Data Structures & Algorithms',
    title: 'Algorithms and Data Structures Tutorial - Full Course for Midterm Exams',
    channel: 'freeCodeCamp.org',
    youtubeId: '8hly31xKli0',
    youtubeUrl: 'https://www.youtube.com/watch?v=8hly31xKli0',
    type: 'crash-course',
    typeLabel: 'Crash Course (One-Shot)',
    duration: '5h 22m',
    views: '2.4M views',
    level: 'Exam Prep & Fast Revision',
    thumbnailUrl: 'https://img.youtube.com/vi/8hly31xKli0/hqdefault.jpg',
    description: 'A comprehensive one-shot review covering algorithm design, Big-O notation, merge sort, quicksort, and recursive divide-and-conquer paradigms.',
    keyTopics: ['Big-O Notation', 'Recursion', 'Merge Sort', 'Quicksort', 'Search Algorithms'],
  },
  {
    id: 'yt-dsa-3',
    subject: 'Data Structures & Algorithms',
    title: 'How Graph Algorithms Actually Work — Dijkstra, BFS, DFS Visualized',
    channel: 'Reducible',
    youtubeId: 'pcKY4hjDrxk',
    youtubeUrl: 'https://www.youtube.com/watch?v=pcKY4hjDrxk',
    type: 'concept-animation',
    typeLabel: 'Visual Animation',
    duration: '18m 42s',
    views: '1.9M views',
    level: 'Intuitive Deep-Dive',
    thumbnailUrl: 'https://img.youtube.com/vi/pcKY4hjDrxk/hqdefault.jpg',
    description: 'Beautiful animated visual breakdown of shortest path algorithms, priority queues, and how Dijkstra solves network routing challenges.',
    keyTopics: ['Dijkstra', 'Graph Traversal', 'Priority Queue', 'Shortest Path', 'Visual Graphs'],
  },
  {
    id: 'yt-dsa-4',
    subject: 'Data Structures & Algorithms',
    title: 'Top 10 Graph & Dynamic Programming Midterm Exam Problems Solved',
    channel: 'Gate Smashers',
    youtubeId: '09_LlHjoEiY',
    youtubeUrl: 'https://www.youtube.com/watch?v=09_LlHjoEiY',
    type: 'exam-problems',
    typeLabel: 'Exam Solved Questions',
    duration: '1h 12m',
    views: '1.1M views',
    level: 'Midterm & Final Exam',
    thumbnailUrl: 'https://img.youtube.com/vi/09_LlHjoEiY/hqdefault.jpg',
    description: 'Step-by-step mathematical derivations and numerical solutions for Bellman-Ford, Floyd-Warshall, and topological sorting examination questions.',
    keyTopics: ['Bellman Ford', 'Floyd Warshall', 'Topological Sort', 'DAGs', 'Past Paper Solutions'],
  },

  // -------------------------------------------------------------------------
  // 2. OPERATING SYSTEMS
  // -------------------------------------------------------------------------
  {
    id: 'yt-os-1',
    subject: 'Operating Systems',
    title: 'Operating Systems Complete Course - From Processes to File Systems',
    channel: 'Gate Smashers',
    youtubeId: 'bkSWJJZNgf8',
    youtubeUrl: 'https://www.youtube.com/watch?v=bkSWJJZNgf8',
    type: 'full-course',
    typeLabel: 'Full University Course',
    duration: '14h 30m',
    views: '5.2M views',
    level: 'University Curriculum',
    thumbnailUrl: 'https://img.youtube.com/vi/bkSWJJZNgf8/hqdefault.jpg',
    description: 'The definitive operating systems curriculum covering system calls, multithreading, CPU scheduling algorithms, synchronization primitives, deadlocks, and virtual memory.',
    keyTopics: ['Processes', 'CPU Scheduling', 'Semaphores', 'Deadlocks', 'Virtual Memory', 'Paging'],
  },
  {
    id: 'yt-os-2',
    subject: 'Operating Systems',
    title: 'Operating Systems in 1 Shot - Complete Semester Exam Revision',
    channel: 'Nesoi Academy',
    youtubeId: 'vBURTt97EkA',
    youtubeUrl: 'https://www.youtube.com/watch?v=vBURTt97EkA',
    type: 'crash-course',
    typeLabel: 'Crash Course (One-Shot)',
    duration: '3h 15m',
    views: '1.8M views',
    level: 'High-Yield Exam Prep',
    thumbnailUrl: 'https://img.youtube.com/vi/vBURTt97EkA/hqdefault.jpg',
    description: 'Fast-paced revision designed for last-minute midterm and university final preparation with high-yield formulas and definitions.',
    keyTopics: ['Preemptive Scheduling', 'FCFS', 'Round Robin', 'Banker Algorithm', 'Page Replacement'],
  },
  {
    id: 'yt-os-3',
    subject: 'Operating Systems',
    title: 'How Virtual Memory & Paging Work - Animated Systems Architecture',
    channel: 'ByteByteGo',
    youtubeId: '2qukffpB36U',
    youtubeUrl: 'https://www.youtube.com/watch?v=2qukffpB36U',
    type: 'concept-animation',
    typeLabel: 'Visual Animation',
    duration: '14m 20s',
    views: '890K views',
    level: 'Visual Architecture',
    thumbnailUrl: 'https://img.youtube.com/vi/2qukffpB36U/hqdefault.jpg',
    description: 'Clear graphical animation explaining Memory Management Units (MMU), Translation Lookaside Buffers (TLB), page tables, and page faults.',
    keyTopics: ['MMU', 'TLB', 'Page Tables', 'Page Faults', 'Segmentation'],
  },
  {
    id: 'yt-os-4',
    subject: 'Operating Systems',
    title: 'Banker\'s Algorithm & Deadlock Avoidance Numerical Problems Solved',
    channel: 'Gate Smashers',
    youtubeId: 'T0FXvTHcYi4',
    youtubeUrl: 'https://www.youtube.com/watch?v=T0FXvTHcYi4',
    type: 'exam-problems',
    typeLabel: 'Exam Solved Questions',
    duration: '45m 10s',
    views: '1.4M views',
    level: 'Numerical Problem Solving',
    thumbnailUrl: 'https://img.youtube.com/vi/T0FXvTHcYi4/hqdefault.jpg',
    description: 'Worked numerical examination problems: Allocation matrix, Maximum need matrix, Available resources, and Safety algorithm verification.',
    keyTopics: ['Banker Algorithm', 'Safe State', 'Resource Request', 'Deadlock Detection'],
  },

  // -------------------------------------------------------------------------
  // 3. DATABASE SYSTEMS
  // -------------------------------------------------------------------------
  {
    id: 'yt-db-1',
    subject: 'Database Systems',
    title: 'Database Design and Management Course - Full University Curriculum',
    channel: 'freeCodeCamp.org',
    youtubeId: 'HXV3zeQKqGY',
    youtubeUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    type: 'full-course',
    typeLabel: 'Full University Course',
    duration: '8h 20m',
    views: '3.1M views',
    level: 'Beginner to Advanced',
    thumbnailUrl: 'https://img.youtube.com/vi/HXV3zeQKqGY/hqdefault.jpg',
    description: 'Learn relational database modeling, relational algebra, entity-relationship diagrams (ERDs), SQL queries, transactions, and indexing.',
    keyTopics: ['Relational Model', 'SQL Queries', 'ER Diagrams', 'Normal Forms', 'Transactions'],
  },
  {
    id: 'yt-db-2',
    subject: 'Database Systems',
    title: 'SQL and DBMS One-Shot Revision for Semester Exams',
    channel: 'Gate Smashers',
    youtubeId: 'kBdlM6hNDAE',
    youtubeUrl: 'https://www.youtube.com/watch?v=kBdlM6hNDAE',
    type: 'crash-course',
    typeLabel: 'Crash Course (One-Shot)',
    duration: '4h 05m',
    views: '2.6M views',
    level: 'Exam Prep',
    thumbnailUrl: 'https://img.youtube.com/vi/kBdlM6hNDAE/hqdefault.jpg',
    description: 'Everything you need to score top marks in your DBMS exam: DDL, DML, subqueries, group by, joins, and indexing structures.',
    keyTopics: ['SQL Joins', 'Subqueries', 'Indexes', 'Views', 'Triggers', 'Aggregation'],
  },
  {
    id: 'yt-db-3',
    subject: 'Database Systems',
    title: 'How B-Trees & B+ Trees Work in Databases - Visual Architecture',
    channel: 'ByteByteGo',
    youtubeId: 'ipv_qPzD_0I',
    youtubeUrl: 'https://www.youtube.com/watch?v=ipv_qPzD_0I',
    type: 'concept-animation',
    typeLabel: 'Visual Animation',
    duration: '12m 30s',
    views: '940K views',
    level: 'Architecture Deep-Dive',
    thumbnailUrl: 'https://img.youtube.com/vi/ipv_qPzD_0I/hqdefault.jpg',
    description: 'Visualizing why relational databases like PostgreSQL and MySQL use B+ trees for logarithmic index traversal and range queries.',
    keyTopics: ['B-Trees', 'B+ Trees', 'Clustered Index', 'Logarithmic Search', 'Disk I/O'],
  },
  {
    id: 'yt-db-4',
    subject: 'Database Systems',
    title: 'Normalization (1NF, 2NF, 3NF, BCNF) Solved Examination Problems',
    channel: 'Gate Smashers',
    youtubeId: '5fs1PR85e_k',
    youtubeUrl: 'https://www.youtube.com/watch?v=5fs1PR85e_k',
    type: 'exam-problems',
    typeLabel: 'Exam Solved Questions',
    duration: '52m 18s',
    views: '1.7M views',
    level: 'Exam Problem Solving',
    thumbnailUrl: 'https://img.youtube.com/vi/5fs1PR85e_k/hqdefault.jpg',
    description: 'Functional dependencies, candidate key derivation, lossy vs lossless decomposition, and dependency preservation solved step-by-step.',
    keyTopics: ['Functional Dependencies', 'Candidate Keys', '3NF vs BCNF', 'Lossless Decomposition'],
  },

  // -------------------------------------------------------------------------
  // 4. COMPUTER NETWORKS
  // -------------------------------------------------------------------------
  {
    id: 'yt-cn-1',
    subject: 'Computer Networks',
    title: 'Computer Networking Complete Course - Beginner to Advanced',
    channel: 'freeCodeCamp.org',
    youtubeId: 'IPvYjXCsTg8',
    youtubeUrl: 'https://www.youtube.com/watch?v=IPvYjXCsTg8',
    type: 'full-course',
    typeLabel: 'Full University Course',
    duration: '9h 15m',
    views: '3.9M views',
    level: 'Complete Curriculum',
    thumbnailUrl: 'https://img.youtube.com/vi/IPvYjXCsTg8/hqdefault.jpg',
    description: 'Full course covering network topologies, the OSI 7-layer model, TCP/IP, IP addressing, subnetting, routing protocols, and transport layer reliability.',
    keyTopics: ['OSI Model', 'TCP/IP', 'Routing Protocols', 'DNS & DHCP', 'Transport Layer', 'Sockets'],
  },
  {
    id: 'yt-cn-2',
    subject: 'Computer Networks',
    title: 'Computer Networks in 1 Shot - Complete Exam Revision',
    channel: 'Gate Smashers',
    youtubeId: 'JFF2vJaN0Cw',
    youtubeUrl: 'https://www.youtube.com/watch?v=JFF2vJaN0Cw',
    type: 'crash-course',
    typeLabel: 'Crash Course (One-Shot)',
    duration: '3h 45m',
    views: '2.1M views',
    level: 'Midterm & Final Prep',
    thumbnailUrl: 'https://img.youtube.com/vi/JFF2vJaN0Cw/hqdefault.jpg',
    description: 'High-speed revision of flow control (Stop and Wait, Go-Back-N, Selective Repeat), congestion control, and TCP sliding windows.',
    keyTopics: ['Flow Control', 'Go-Back-N', 'Selective Repeat', 'TCP 3-Way Handshake', 'Congestion Window'],
  },
  {
    id: 'yt-cn-3',
    subject: 'Computer Networks',
    title: 'TCP 3-Way Handshake & Connection Termination Visualized',
    channel: 'PowerCert Animated Videos',
    youtubeId: 'aircAruvnKk',
    youtubeUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
    type: 'concept-animation',
    typeLabel: 'Visual Animation',
    duration: '8m 55s',
    views: '1.5M views',
    level: 'Visual Walkthrough',
    thumbnailUrl: 'https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg',
    description: 'Clear animated depiction of SYN, SYN-ACK, ACK packet exchange, sequence number synchronization, and FIN teardown.',
    keyTopics: ['SYN Packet', 'SYN-ACK', 'Sequence Numbers', 'FIN Teardown', 'Reliable Transport'],
  },
  {
    id: 'yt-cn-4',
    subject: 'Computer Networks',
    title: 'IPv4 Subnetting & CIDR Calculation Tricks Solved for Exams',
    channel: 'NetworkChuck',
    youtubeId: 's_Ntt6eTn94',
    youtubeUrl: 'https://www.youtube.com/watch?v=s_Ntt6eTn94',
    type: 'exam-problems',
    typeLabel: 'Exam Solved Questions',
    duration: '32m 40s',
    views: '3.2M views',
    level: 'Numerical Problem Solving',
    thumbnailUrl: 'https://img.youtube.com/vi/s_Ntt6eTn94/hqdefault.jpg',
    description: 'Master binary and decimal subnetting calculations, usable host formulas, broadcast addresses, and CIDR prefix masks in minutes.',
    keyTopics: ['Subnet Masks', 'CIDR Notation', 'Network Address', 'Broadcast Address', 'Usable Hosts'],
  },

  // -------------------------------------------------------------------------
  // 5. ARTIFICIAL INTELLIGENCE
  // -------------------------------------------------------------------------
  {
    id: 'yt-ai-1',
    subject: 'Artificial Intelligence',
    title: 'Machine Learning Course for Beginners - Complete University Curriculum',
    channel: 'freeCodeCamp.org',
    youtubeId: 'i_LwzRVP7bg',
    youtubeUrl: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
    type: 'full-course',
    typeLabel: 'Full University Course',
    duration: '9h 52m',
    views: '2.8M views',
    level: 'Complete Curriculum',
    thumbnailUrl: 'https://img.youtube.com/vi/i_LwzRVP7bg/hqdefault.jpg',
    description: 'Covers supervised learning, unsupervised learning, regression, classification, support vector machines, random forests, and neural networks.',
    keyTopics: ['Linear Regression', 'Logistic Regression', 'SVM', 'Random Forests', 'K-Means', 'PCA'],
  },
  {
    id: 'yt-ai-2',
    subject: 'Artificial Intelligence',
    title: 'Artificial Intelligence in 1 Shot - Full Exam Review',
    channel: 'Gate Smashers',
    youtubeId: '5NgNicANyjM',
    youtubeUrl: 'https://www.youtube.com/watch?v=5NgNicANyjM',
    type: 'crash-course',
    typeLabel: 'Crash Course (One-Shot)',
    duration: '3h 30m',
    views: '1.9M views',
    level: 'Midterm Prep',
    thumbnailUrl: 'https://img.youtube.com/vi/5NgNicANyjM/hqdefault.jpg',
    description: 'Comprehensive review of AI search agents, A* search, Minimax with Alpha-Beta pruning, constraint satisfaction problems, and propositional logic.',
    keyTopics: ['A* Search', 'Alpha-Beta Pruning', 'Heuristics', 'Minimax', 'Inference Rules'],
  },
  {
    id: 'yt-ai-3',
    subject: 'Artificial Intelligence',
    title: 'What is Backpropagation Really Doing? Visual Calculus',
    channel: '3Blue1Brown',
    youtubeId: 'Ilg3gGewQ5U',
    youtubeUrl: 'https://www.youtube.com/watch?v=Ilg3gGewQ5U',
    type: 'concept-animation',
    typeLabel: 'Visual Animation',
    duration: '14m 10s',
    views: '5.6M views',
    level: 'Visual Mathematics',
    thumbnailUrl: 'https://img.youtube.com/vi/Ilg3gGewQ5U/hqdefault.jpg',
    description: 'The definitive visual explanation of gradient descent and how the chain rule propagates error gradients backward through weights and biases.',
    keyTopics: ['Gradient Descent', 'Chain Rule', 'Loss Surface', 'Weight Updates', 'Activation Functions'],
  },
  {
    id: 'yt-ai-4',
    subject: 'Artificial Intelligence',
    title: 'A* Algorithm & Heuristic Function Solved Examination Problems',
    channel: 'Gate Smashers',
    youtubeId: 'tvAh0JZF2JE',
    youtubeUrl: 'https://www.youtube.com/watch?v=tvAh0JZF2JE',
    type: 'exam-problems',
    typeLabel: 'Exam Solved Questions',
    duration: '28m 15s',
    views: '980K views',
    level: 'Numerical Problem Solving',
    thumbnailUrl: 'https://img.youtube.com/vi/tvAh0JZF2JE/hqdefault.jpg',
    description: 'Worked step-by-step 8-puzzle and graph state evaluation using f(n) = g(n) + h(n), checking admissibility and consistency.',
    keyTopics: ['Admissible Heuristic', 'f(n) = g(n) + h(n)', '8-Puzzle Problem', 'Optimality'],
  },

  // -------------------------------------------------------------------------
  // 6. MATHEMATICS
  // -------------------------------------------------------------------------
  {
    id: 'yt-math-1',
    subject: 'Mathematics',
    title: 'Linear Algebra Full University Course - MIT 18.06 (Prof. Gilbert Strang)',
    channel: 'MIT OpenCourseWare',
    youtubeId: '7UJ4CFRGd-U',
    youtubeUrl: 'https://www.youtube.com/watch?v=7UJ4CFRGd-U',
    type: 'full-course',
    typeLabel: 'Full University Course',
    duration: '35 Lectures',
    views: '8.4M views',
    level: 'World-Class MIT Lecture Series',
    thumbnailUrl: 'https://img.youtube.com/vi/7UJ4CFRGd-U/hqdefault.jpg',
    description: 'The world-famous MIT lecture series covering vector spaces, subspaces, null spaces, projections, determinant properties, eigenvalues, and SVD.',
    keyTopics: ['Vector Spaces', 'Eigenvalues', 'Null Space', 'Orthogonal Projections', 'SVD'],
  },
  {
    id: 'yt-math-2',
    subject: 'Mathematics',
    title: 'Essence of Linear Algebra — Preview & Full Concept Journey',
    channel: '3Blue1Brown',
    youtubeId: 'fNk_zzaMoSs',
    youtubeUrl: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
    type: 'concept-animation',
    typeLabel: 'Visual Animation',
    duration: '2h 40m',
    views: '9.2M views',
    level: 'Visual Intuition Masterclass',
    thumbnailUrl: 'https://img.youtube.com/vi/fNk_zzaMoSs/hqdefault.jpg',
    description: 'Geometric perspective on vectors, linear transformations, matrix multiplication, determinants, and change of basis.',
    keyTopics: ['Determinants', 'Linear Transformations', 'Eigenvectors', 'Matrix Multiplication', 'Geometric Space'],
  },
  {
    id: 'yt-math-3',
    subject: 'Mathematics',
    title: 'Multivariable Calculus & Differential Equations Solved Exam Problems',
    channel: 'The Organic Chemistry Tutor',
    youtubeId: '68Mv8U_0m8I',
    youtubeUrl: 'https://www.youtube.com/watch?v=68Mv8U_0m8I',
    type: 'exam-problems',
    typeLabel: 'Exam Solved Questions',
    duration: '2h 15m',
    views: '1.4M views',
    level: 'Midterm Examination Walkthrough',
    thumbnailUrl: 'https://img.youtube.com/vi/68Mv8U_0m8I/hqdefault.jpg',
    description: 'Step-by-step solved problems on partial derivatives, directional derivatives, gradient vectors, double integrals, and Stokes theorem.',
    keyTopics: ['Partial Derivatives', 'Double Integrals', 'Green Theorem', 'Stokes Theorem', 'Gradients'],
  },

  // -------------------------------------------------------------------------
  // 7. WEB TECHNOLOGIES
  // -------------------------------------------------------------------------
  {
    id: 'yt-web-1',
    subject: 'Web Technologies',
    title: 'Full Stack Web Development Course - HTML, CSS, JavaScript, React & Node',
    channel: 'freeCodeCamp.org',
    youtubeId: 'nu_pCVPKzTk',
    youtubeUrl: 'https://www.youtube.com/watch?v=nu_pCVPKzTk',
    type: 'full-course',
    typeLabel: 'Full Course',
    duration: '11h 45m',
    views: '4.2M views',
    level: 'Full Stack',
    thumbnailUrl: 'https://img.youtube.com/vi/nu_pCVPKzTk/hqdefault.jpg',
    description: 'Comprehensive curriculum from frontend basics through modern reactive frameworks, REST APIs, and backend database integrations.',
    keyTopics: ['HTML5 & CSS3', 'JavaScript ES6+', 'React', 'Node.js', 'REST APIs', 'Async Await'],
  },
  {
    id: 'yt-web-2',
    subject: 'Web Technologies',
    title: 'How the Web Works — HTTP, DNS, Browsers & Event Loop Visualized',
    channel: 'Fireship',
    youtubeId: 'hJHvdBlSxug',
    youtubeUrl: 'https://www.youtube.com/watch?v=hJHvdBlSxug',
    type: 'concept-animation',
    typeLabel: 'Visual Animation',
    duration: '12m 10s',
    views: '2.1M views',
    level: 'Architecture Deep-Dive',
    thumbnailUrl: 'https://img.youtube.com/vi/hJHvdBlSxug/hqdefault.jpg',
    description: 'Visual breakdown of the browser rendering pipeline, V8 JavaScript event loop, and network socket transitions.',
    keyTopics: ['Event Loop', 'DOM Rendering', 'HTTP/2 vs HTTP/3', 'V8 Engine', 'WebSockets'],
  },

  // -------------------------------------------------------------------------
  // 8. THEORY OF COMPUTATION
  // -------------------------------------------------------------------------
  {
    id: 'yt-toc-1',
    subject: 'Theory of Computation',
    title: 'Theory of Computation (Automata Theory) Complete Playlist',
    channel: 'Gate Smashers',
    youtubeId: 'XslI8h7c9as',
    youtubeUrl: 'https://www.youtube.com/watch?v=XslI8h7c9as',
    type: 'full-course',
    typeLabel: 'Full University Course',
    duration: '10h 15m',
    views: '3.4M views',
    level: 'University Curriculum',
    thumbnailUrl: 'https://img.youtube.com/vi/XslI8h7c9as/hqdefault.jpg',
    description: 'Finite automata (DFA, NFA), regular expressions, context-free grammars, pushdown automata (PDA), and Turing machines.',
    keyTopics: ['DFA Construction', 'NFA to DFA', 'Chomsky Hierarchy', 'Turing Machines', 'Decidability'],
  },
  {
    id: 'yt-toc-2',
    subject: 'Theory of Computation',
    title: 'Turing Machines & The Halting Problem Explained',
    channel: 'Computerphile',
    youtubeId: 'macM_MtS_w4',
    youtubeUrl: 'https://www.youtube.com/watch?v=macM_MtS_w4',
    type: 'concept-animation',
    typeLabel: 'Visual Animation',
    duration: '11m 40s',
    views: '1.6M views',
    level: 'Intuitive Theory',
    thumbnailUrl: 'https://img.youtube.com/vi/macM_MtS_w4/hqdefault.jpg',
    description: 'Visual animation explaining Alan Turing’s universal computing machine, diagonal arguments, and undecidable languages.',
    keyTopics: ['Universal Turing Machine', 'Halting Problem', 'Diagonalization', 'Undecidability'],
  },

  // -------------------------------------------------------------------------
  // 9. CYBERSECURITY
  // -------------------------------------------------------------------------
  {
    id: 'yt-sec-1',
    subject: 'Cybersecurity',
    title: 'Cybersecurity Full Course for Beginners - Complete Curriculum',
    channel: 'freeCodeCamp.org',
    youtubeId: 'U_P23SqJaDc',
    youtubeUrl: 'https://www.youtube.com/watch?v=U_P23SqJaDc',
    type: 'full-course',
    typeLabel: 'Full Course',
    duration: '7h 10m',
    views: '2.9M views',
    level: 'Beginner to Security Analyst',
    thumbnailUrl: 'https://img.youtube.com/vi/U_P23SqJaDc/hqdefault.jpg',
    description: 'Learn ethical hacking fundamentals, cryptography, network defense, penetration testing methodologies, and web vulnerabilities.',
    keyTopics: ['Network Security', 'Cryptography', 'Penetration Testing', 'OWASP Top 10', 'Firewalls'],
  },
  {
    id: 'yt-sec-2',
    subject: 'Cybersecurity',
    title: 'Public Key Cryptography & Diffie-Hellman Key Exchange Visualized',
    channel: 'Computerphile',
    youtubeId: 'YEBfamv-_do',
    youtubeUrl: 'https://www.youtube.com/watch?v=YEBfamv-_do',
    type: 'concept-animation',
    typeLabel: 'Visual Animation',
    duration: '10m 50s',
    views: '3.1M views',
    level: 'Visual Mathematics',
    thumbnailUrl: 'https://img.youtube.com/vi/YEBfamv-_do/hqdefault.jpg',
    description: 'Paint-mixing analogy and modular arithmetic visualizing asymmetric encryption, RSA principles, and secure channel negotiation.',
    keyTopics: ['Diffie-Hellman', 'Asymmetric Encryption', 'RSA', 'Modular Arithmetic', 'Public-Private Keys'],
  },

  // -------------------------------------------------------------------------
  // 10. CLOUD COMPUTING
  // -------------------------------------------------------------------------
  {
    id: 'yt-cloud-1',
    subject: 'Cloud Computing',
    title: 'Cloud Computing Full Course - Architecture, Infrastructure & Services',
    channel: 'freeCodeCamp.org',
    youtubeId: '2LaAJq1lB1Q',
    youtubeUrl: 'https://www.youtube.com/watch?v=2LaAJq1lB1Q',
    type: 'full-course',
    typeLabel: 'Full Course',
    duration: '6h 30m',
    views: '1.7M views',
    level: 'Cloud Fundamentals',
    thumbnailUrl: 'https://img.youtube.com/vi/2LaAJq1lB1Q/hqdefault.jpg',
    description: 'Cloud deployment models (IaaS, PaaS, SaaS), virtualization, containers, elastic load balancing, and distributed storage systems.',
    keyTopics: ['IaaS vs PaaS', 'Virtualization', 'Elastic Computing', 'Object Storage', 'Serverless'],
  },
  {
    id: 'yt-cloud-2',
    subject: 'Cloud Computing',
    title: 'Docker & Kubernetes in 100 Seconds + Architecture Visualized',
    channel: 'Fireship',
    youtubeId: 'Gjnup-PuquQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=Gjnup-PuquQ',
    type: 'concept-animation',
    typeLabel: 'Visual Animation',
    duration: '11m 20s',
    views: '2.5M views',
    level: 'Architecture Walkthrough',
    thumbnailUrl: 'https://img.youtube.com/vi/Gjnup-PuquQ/hqdefault.jpg',
    description: 'Visualizing containerization vs virtual machines, pod scheduling, cluster ingress, and microservices orchestration.',
    keyTopics: ['Docker Containers', 'Kubernetes Pods', 'Cluster Ingress', 'Microservices', 'Load Balancing'],
  },

  // -------------------------------------------------------------------------
  // 11. SOFTWARE ENGINEERING
  // -------------------------------------------------------------------------
  {
    id: 'yt-se-1',
    subject: 'Software Engineering',
    title: 'Software Engineering Complete Course - SDLC, Agile, Architecture & Testing',
    channel: 'Gate Smashers',
    youtubeId: 'uJp6wODv_eA',
    youtubeUrl: 'https://www.youtube.com/watch?v=uJp6wODv_eA',
    type: 'full-course',
    typeLabel: 'Full University Course',
    duration: '8h 40m',
    views: '2.2M views',
    level: 'University Curriculum',
    thumbnailUrl: 'https://img.youtube.com/vi/uJp6wODv_eA/hqdefault.jpg',
    description: 'Software development life cycle models (Waterfall, Spiral, Agile Scrum), requirement engineering, UML diagrams, COCOMO estimation, and software testing.',
    keyTopics: ['SDLC Models', 'Agile & Scrum', 'UML Diagrams', 'COCOMO Model', 'Software Testing'],
  },

  // -------------------------------------------------------------------------
  // 12. ELECTRICAL & ELECTRONICS
  // -------------------------------------------------------------------------
  {
    id: 'yt-ee-1',
    subject: 'Electrical & Electronics',
    title: 'Circuits and Electronics - MIT 6.002 (Prof. Anant Agarwal)',
    channel: 'MIT OpenCourseWare',
    youtubeId: 'AfQxyVuLeCs',
    youtubeUrl: 'https://www.youtube.com/watch?v=AfQxyVuLeCs',
    type: 'full-course',
    typeLabel: 'Full University Course',
    duration: '25 Lectures',
    views: '4.6M views',
    level: 'World-Class MIT Course',
    thumbnailUrl: 'https://img.youtube.com/vi/AfQxyVuLeCs/hqdefault.jpg',
    description: 'The iconic MIT course on lumped circuit abstraction, KVL, KCL, Thevenin and Norton equivalence, operational amplifiers, and digital abstractions.',
    keyTopics: ['KVL & KCL', 'Thevenin Theorem', 'Norton Theorem', 'Op-Amps', 'MOSFETs', 'RLC Circuits'],
  },
  {
    id: 'yt-ee-2',
    subject: 'Electrical & Electronics',
    title: 'How Transistors and Logic Gates Work - Animated Electronics',
    channel: 'The Engineering Mindset',
    youtubeId: 'J4oO7PT_nY4',
    youtubeUrl: 'https://www.youtube.com/watch?v=J4oO7PT_nY4',
    type: 'concept-animation',
    typeLabel: 'Visual Animation',
    duration: '12m 45s',
    views: '3.8M views',
    level: 'Visual Physics & Hardware',
    thumbnailUrl: 'https://img.youtube.com/vi/J4oO7PT_nY4/hqdefault.jpg',
    description: 'Electrons, semi-conductors, p-n junctions, bipolar junction transistors, and how billions of microscopic switches form modern microprocessors.',
    keyTopics: ['Semiconductors', 'P-N Junction', 'Transistor Switching', 'Logic Gates', 'Current Flow'],
  },
];

/**
 * Filter and query YouTube videos by subject, keyword, and category
 */
export function getYouTubeVideos(params: {
  subject?: string;
  query?: string;
  type?: YouTubeVideoType;
}): YouTubeVideo[] {
  const { subject, query, type = 'all' } = params;

  return youtubeVideosCatalog.filter((video) => {
    // Subject filter (if not 'All Subjects')
    if (subject && subject !== 'All Subjects' && video.subject.toLowerCase() !== subject.toLowerCase()) {
      return false;
    }

    // Type filter
    if (type !== 'all' && video.type !== type) {
      return false;
    }

    // Query filter
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      const matchesTitle = video.title.toLowerCase().includes(q);
      const matchesChannel = video.channel.toLowerCase().includes(q);
      const matchesSubject = video.subject.toLowerCase().includes(q);
      const matchesDesc = video.description.toLowerCase().includes(q);
      const matchesTopics = video.keyTopics.some((t) => t.toLowerCase().includes(q));

      if (!matchesTitle && !matchesChannel && !matchesSubject && !matchesDesc && !matchesTopics) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Generates an external YouTube search URL for the subject / topic
 */
export function getDirectYouTubeSearchUrl(subject: string, query?: string): string {
  const terms = [
    subject !== 'All Subjects' ? subject : '',
    query || '',
    'full lecture crash course tutorial',
  ]
    .filter(Boolean)
    .join(' ');

  return `https://www.youtube.com/results?search_query=${encodeURIComponent(terms)}`;
}
