import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Class, Student } from '@/types/attendance';
import { MOCK_CLASSES, subjects } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users, GraduationCap, School } from 'lucide-react';

const DataSiswa = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newClassName, setNewClassName] = useState('');
  const [newStudent, setNewStudent] = useState({
    id: '',
    name: '',
    classId: '',
    schoolOrigin: '',
    selectedSubjects: [] as string[]
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedClasses = JSON.parse(localStorage.getItem('schoolClasses') || JSON.stringify(MOCK_CLASSES));
    const allStudents = savedClasses.flatMap((cls: Class) => cls.students);
    setClasses(savedClasses);
    setStudents(allStudents);
  };

  const saveData = (updatedClasses: Class[]) => {
    localStorage.setItem('schoolClasses', JSON.stringify(updatedClasses));
    loadData();
  };

  const addClass = () => {
    if (!newClassName.trim()) {
      toast({
        title: "Error",
        description: "Nama kelas tidak boleh kosong",
        variant: "destructive"
      });
      return;
    }

    const newClass: Class = {
      id: `class-${Date.now()}`,
      name: newClassName,
      students: []
    };

    const updatedClasses = [...classes, newClass];
    saveData(updatedClasses);
    setNewClassName('');
    setIsAddClassOpen(false);
    
    toast({
      title: "Berhasil",
      description: `Kelas "${newClassName}" berhasil ditambahkan`
    });
  };

  const addStudent = () => {
    if (!newStudent.name.trim() || !newStudent.classId) {
      toast({
        title: "Error",
        description: "Nama siswa dan kelas harus diisi",
        variant: "destructive"
      });
      return;
    }

    const studentId = newStudent.id.trim() || `student-${Date.now()}`;
    const now = new Date().toISOString();
    
    const student: Student = {
      id: studentId,
      name: newStudent.name,
      classId: newStudent.classId,
      schoolOrigin: newStudent.schoolOrigin,
      selectedSubjects: newStudent.selectedSubjects,
      createdAt: now,
      updatedAt: now
    };

    const updatedClasses = classes.map(cls => {
      if (cls.id === newStudent.classId) {
        return {
          ...cls,
          students: [...cls.students, student]
        };
      }
      return cls;
    });

    saveData(updatedClasses);
    setNewStudent({
      id: '',
      name: '',
      classId: '',
      schoolOrigin: '',
      selectedSubjects: []
    });
    setIsAddStudentOpen(false);
    
    toast({
      title: "Berhasil",
      description: `Siswa "${newStudent.name}" berhasil ditambahkan`
    });
  };

  const editStudent = (student: Student) => {
    setEditingStudent(student);
    setIsEditStudentOpen(true);
  };

  const updateStudent = () => {
    if (!editingStudent) return;

    const updatedClasses = classes.map(cls => ({
      ...cls,
      students: cls.students.map(student => 
        student.id === editingStudent.id 
          ? { ...editingStudent, updatedAt: new Date().toISOString() }
          : student
      )
    }));

    saveData(updatedClasses);
    setEditingStudent(null);
    setIsEditStudentOpen(false);
    
    toast({
      title: "Berhasil",
      description: "Data siswa berhasil diperbarui"
    });
  };

  const deleteStudent = (studentId: string) => {
    const updatedClasses = classes.map(cls => ({
      ...cls,
      students: cls.students.filter(student => student.id !== studentId)
    }));

    saveData(updatedClasses);
    toast({
      title: "Berhasil",
      description: "Siswa berhasil dihapus"
    });
  };

  const handleSubjectChange = (subject: string, checked: boolean, isEdit: boolean = false) => {
    if (isEdit && editingStudent) {
      const updatedSubjects = checked
        ? [...(editingStudent.selectedSubjects || []), subject]
        : (editingStudent.selectedSubjects || []).filter(s => s !== subject);
      
      setEditingStudent({
        ...editingStudent,
        selectedSubjects: updatedSubjects
      });
    } else {
      const updatedSubjects = checked
        ? [...newStudent.selectedSubjects, subject]
        : newStudent.selectedSubjects.filter(s => s !== subject);
      
      setNewStudent({
        ...newStudent,
        selectedSubjects: updatedSubjects
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Siswa</h1>
          <p className="text-muted-foreground">Kelola kelas dan data siswa</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kelas
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Kelas Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="className">Nama Kelas</Label>
                  <Input
                    id="className"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Contoh: Kelas 7A"
                  />
                </div>
                <Button onClick={addClass} className="w-full">
                  Tambah Kelas
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Siswa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Siswa Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentId">ID Siswa (opsional)</Label>
                    <Input
                      id="studentId"
                      value={newStudent.id}
                      onChange={(e) => setNewStudent({...newStudent, id: e.target.value})}
                      placeholder="Biarkan kosong untuk auto-generate"
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentName">Nama Siswa</Label>
                    <Input
                      id="studentName"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      placeholder="Nama lengkap siswa"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Kelas</Label>
                    <Select value={newStudent.classId} onValueChange={(value) => setNewStudent({...newStudent, classId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map(cls => (
                          <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="schoolOrigin">Asal Sekolah</Label>
                    <Input
                      id="schoolOrigin"
                      value={newStudent.schoolOrigin}
                      onChange={(e) => setNewStudent({...newStudent, schoolOrigin: e.target.value})}
                      placeholder="Contoh: SD Negeri 1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Mata Pelajaran Pilihan</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {subjects.map(subject => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subject-${subject}`}
                          checked={newStudent.selectedSubjects.includes(subject)}
                          onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                        />
                        <Label htmlFor={`subject-${subject}`} className="text-sm">{subject}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={addStudent} className="w-full">
                  Tambah Siswa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Kelas</p>
                <p className="text-2xl font-bold text-primary">{classes.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Siswa</p>
                <p className="text-2xl font-bold text-success">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rata-rata per Kelas</p>
                <p className="text-2xl font-bold text-info">
                  {classes.length > 0 ? Math.round(students.length / classes.length) : 0}
                </p>
              </div>
              <School className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Semua Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Siswa</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Asal Sekolah</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => {
                  const studentClass = classes.find(cls => cls.id === student.classId);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-sm">{student.id}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{studentClass?.name || 'Kelas tidak ditemukan'}</TableCell>
                      <TableCell>{student.schoolOrigin || '-'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(student.selectedSubjects || []).map(subject => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                          {(!student.selectedSubjects || student.selectedSubjects.length === 0) && (
                            <span className="text-muted-foreground text-sm">Tidak ada</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editStudent(student)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteStudent(student.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Student Dialog */}
      <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Data Siswa</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editStudentId">ID Siswa</Label>
                  <Input
                    id="editStudentId"
                    value={editingStudent.id}
                    onChange={(e) => setEditingStudent({...editingStudent, id: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="editStudentName">Nama Siswa</Label>
                  <Input
                    id="editStudentName"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Kelas</Label>
                  <Select 
                    value={editingStudent.classId} 
                    onValueChange={(value) => setEditingStudent({...editingStudent, classId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editSchoolOrigin">Asal Sekolah</Label>
                  <Input
                    id="editSchoolOrigin"
                    value={editingStudent.schoolOrigin || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, schoolOrigin: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Mata Pelajaran Pilihan</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {subjects.map(subject => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-subject-${subject}`}
                        checked={(editingStudent.selectedSubjects || []).includes(subject)}
                        onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean, true)}
                      />
                      <Label htmlFor={`edit-subject-${subject}`} className="text-sm">{subject}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={updateStudent} className="w-full">
                Simpan Perubahan
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataSiswa;