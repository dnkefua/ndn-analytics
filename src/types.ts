export interface Course {
  id: string;
  level: string;
  category: 'AI_ENGINEERING' | 'PLAY_STORE_DEV' | 'GCP_ARCHITECTURE' | 'BIGDATA_MLOPS' | 'FIREBASE_GCP';
  title: string;
  description: string;
  duration: string;
  credits: string;
  image: string;
  instructorName: string;
  instructorRole: string;
  syllabus: string[];
  prerequisites?: string[];
}

export interface PracticalTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  moduleName: string;
  title: string;
  progress: number;
  videoUrl: string;
  videoPoster: string;
  terminalLanguage: 'python' | 'kotlin' | 'gcloud';
  terminalCode: string;
  terminalOutput: string;
  practicalTasks: PracticalTask[];
  notes: {
    coreConcepts: string;
    proTip: string;
    keyTerms: { term: string; definition: string }[];
  };
  resources: { name: string; url: string; type: string }[];
  instructor: {
    name: string;
    role: string;
    avatar: string;
    online: boolean;
  };
}

export interface SystemStatusItem {
  id: string;
  time: string;
  category: string;
  message: string;
  status: 'info' | 'success' | 'warning';
}

export interface RecommendedTrack {
  id: string;
  title: string;
  description: string;
  modulesCount: number;
  level: string;
  icon: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  moduleId: string;
  idCode: string;
  category: string;
  question: string;
  options: {
    key: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
  potentialRewards: {
    name: string;
    badge: string;
    icon: string;
    color: string;
  }[];
  technicalResources: {
    title: string;
    url: string;
  }[];
}

export interface ActiveBuild {
  id: string;
  title: string;
  description: string;
  repoUrl: string;
  status: 'STABLE_RELEASE' | 'EVAL_RUNNING';
  progressLabel: string;
  progressValue: number;
  complete: boolean;
}

export interface SkillNode {
  id: string;
  label: string;
  level: string;
  icon: string;
  x: number;
  y: number;
}

export interface EvalQueueItem {
  id: string;
  fileName: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface GradeItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  category: string;
  credits: number;
  quizScore: number;
  labScore: number;
  finalGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B';
  status: 'COMPLETED' | 'IN_PROGRESS';
  term: string;
}

export interface TranscriptRecord {
  studentName: string;
  studentId: string;
  enrollmentDate: string;
  gpa: number;
  totalCredits: number;
  cpdPoints: number;
  verificationHash: string;
  grades: GradeItem[];
}

export interface Certificate {
  id: string;
  courseId: string;
  title: string;
  trackName: string;
  recipientName: string;
  issueDate: string;
  verificationId: string;
  badgeIcon: string;
  cpdCredits: number;
  instructorName: string;
  isUnlocked: boolean;
}
