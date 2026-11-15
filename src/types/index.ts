export type FileType = 'PDF' | 'DOCX' | 'ZIP' | 'PPTX';
export type NoteStatus = 'Published' | 'In Review' | 'Draft';
export type NavTab = 'dashboard' | 'explore' | 'uploads' | 'bookmarks' | 'categories' | 'settings';

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
  courseCode: string;
  semester: string;
  uploader: Uploader;
  fileType: FileType;
  fileName: string;
  fileSize: string;
  pageCount?: number;
  downloadsCount: number;
  rating: number;
  reviewsCount: number;
  isBookmarked: boolean;
  status: NoteStatus;
  uploadedAt: string;
  tags: string[];
  isRecommended?: boolean;
  verified?: boolean;
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
