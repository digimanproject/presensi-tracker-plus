export interface Student {
  id: string;
  name: string;
  classId: string;
  schoolOrigin?: string;
  selectedSubjects?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  date: string;
  meetingDay: string;
  status: 'hadir' | 'izin' | 'sakit' | 'tidak_ada_keterangan';
  isLate: boolean;
  lateMinutes?: number;
  subject: string;
  grade?: number;
  notes?: string;
  timestamp: number;
}

export interface Class {
  id: string;
  name: string;
  students: Student[];
}