export type FileType = 'PDF' | 'DOCX' | 'ZIP' | 'PPTX';
export type NoteStatus = 'pending' | 'published' | 'rejected' | 'Published' | 'In Review' | 'Draft';
export type NavTab = 'dashboard' | 'explore' | 'uploads' | 'bookmarks' | 'categories' | 'settings' | 'admin';
export type AdminTab = 'overview' | 'moderation' | 'users' | 'resources' | 'subjects' | 'logs';

export interface Uploader {
  name: string;
  avatar: string;
  department: string;
  isCurrentUser?: boolean;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  subjectId?: string;
  courseCode: string;
  semester: string;
  uploader: Uploader;
  uploaderId?: string;
  fileType: FileType;
  fileName: string;
  fileSize: string;
  filePath?: string;
  pageCount?: number;
  downloadsCount: number;
  rating: number;
  reviewsCount: number;
  isBookmarked: boolean;
  status: NoteStatus;
  rejectionReason?: string;
  uploadedAt: string;
  tags: string[];
  isRecommended?: boolean;
  verified?: boolean;
}

export interface DbSubject {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
  notesCount?: number;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string | null;
  admin_email: string | null;
  action_type: string;
  target_record: string | null;
  details: any;
  created_at: string;
}

export interface AdminUser {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: 'student' | 'admin';
  is_suspended: boolean;
  university: string | null;
  department: string | null;
  semester: string | null;
  created_at: string;
  uploadsCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  badgeColor: string;
  badgeBg: string;
  iconBg: string;
  resourceCount: number;
  coursesCount: number;
  popularTags: string[];
}

export interface Activity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  timeAgo: string;
  type: 'upload' | 'download' | 'bookmark' | 'badge';
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  university: string;
  department: string;
  semester: string;
  studentId: string;
  bio: string;
  reputationPoints: number;
  role: string;
  isSuspended?: boolean;
  emailNotifications: boolean;
  newNoteAlerts: boolean;
  weeklyDigest: boolean;
  defaultFileFormat: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
