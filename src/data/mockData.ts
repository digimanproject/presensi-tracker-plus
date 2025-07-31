import { Class, Student } from '@/types/attendance';

export const subjects = [
  'Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'IPA', 'IPS',
  'Seni Budaya', 'Pendidikan Agama', 'PJOK', 'Prakarya', 'PKN'
];

export const meetingDays = [
  'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

// Generate mock data for 10 classes with 15 students each
export const generateMockClasses = (): Class[] => {
  const classes: Class[] = [];
  
  const studentNames = [
    'Ahmad Fauzi', 'Siti Nurhaliza', 'Budi Santoso', 'Rina Wati', 'Dedi Supriadi',
    'Maya Sari', 'Rizki Pratama', 'Indira Putri', 'Eko Prasetyo', 'Dewi Lestari',
    'Fahmi Rahman', 'Ayu Kartika', 'Reza Mahendra', 'Lina Marlina', 'Andi Wijaya',
    'Putri Amelia', 'Yoga Pradana', 'Sari Rahayu', 'Doni Setiawan', 'Mega Wulandari',
    'Arif Hidayat', 'Nina Safitri', 'Bayu Prakoso', 'Tina Suryani', 'Hendi Kurniawan'
  ];

  for (let i = 1; i <= 10; i++) {
    const classId = `class-${i}`;
    const className = `Kelas ${i}${String.fromCharCode(64 + (i % 5) + 1)}`;
    
    const students: Student[] = [];
    for (let j = 1; j <= 15; j++) {
      const studentIndex = ((i - 1) * 15 + j - 1) % studentNames.length;
      const now = new Date().toISOString();
      students.push({
        id: `${classId}-student-${j}`,
        name: `${studentNames[studentIndex]} ${j}`,
        classId: classId,
        schoolOrigin: `SD Negeri ${Math.floor(Math.random() * 50) + 1}`,
        selectedSubjects: subjects.slice(0, Math.floor(Math.random() * 3) + 2),
        createdAt: now,
        updatedAt: now
      });
    }

    classes.push({
      id: classId,
      name: className,
      students: students
    });
  }

  return classes;
};

export const MOCK_CLASSES = generateMockClasses();
