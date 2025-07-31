import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MOCK_CLASSES, subjects, meetingDays } from '@/data/mockData';
import { AttendanceRecord } from '@/types/attendance';
import { useToast } from '@/hooks/use-toast';
import { Users, Calendar, Clock } from 'lucide-react';

const Presensi = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<{[key: string]: Partial<AttendanceRecord>}>({});
  const { toast } = useToast();

  const selectedClassData = MOCK_CLASSES.find(c => c.id === selectedClass);

  const updateAttendance = (studentId: string, field: keyof AttendanceRecord, value: any) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const saveAttendance = () => {
    if (!selectedClassData) return;

    const records: AttendanceRecord[] = [];
    const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');

    selectedClassData.students.forEach(student => {
      const data = attendanceData[student.id];
      if (data && data.status && data.meetingDay && data.subject) {
        const record: AttendanceRecord = {
          id: `${student.id}-${Date.now()}`,
          studentId: student.id,
          studentName: student.name,
          classId: selectedClass,
          className: selectedClassData.name,
          date: new Date().toISOString().split('T')[0],
          meetingDay: data.meetingDay,
          status: data.status,
          isLate: data.isLate || false,
          lateMinutes: data.lateMinutes,
          subject: data.subject,
          grade: data.grade,
          notes: data.notes,
          timestamp: Date.now()
        } as AttendanceRecord;
        records.push(record);
      }
    });

    if (records.length > 0) {
      localStorage.setItem('attendanceRecords', JSON.stringify([...existingRecords, ...records]));
      setAttendanceData({});
      toast({
        title: "Presensi Tersimpan",
        description: `${records.length} data presensi berhasil disimpan.`,
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Presensi Siswa</h1>
          <p className="text-muted-foreground">Kelola kehadiran siswa harian</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pilih Kelas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih kelas untuk presensi" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_CLASSES.map(cls => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} ({cls.students.length} siswa)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedClassData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Daftar Siswa - {selectedClassData.name}</span>
              <Button onClick={saveAttendance} className="bg-primary">
                Simpan Presensi
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {selectedClassData.students.map(student => (
                <Card key={student.id} className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-4">
                      <h3 className="font-semibold text-lg mb-4">{student.name}</h3>
                    </div>

                    <div>
                      <Label>Hari Pertemuan</Label>
                      <Select 
                        value={attendanceData[student.id]?.meetingDay || ''} 
                        onValueChange={(value) => updateAttendance(student.id, 'meetingDay', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih hari" />
                        </SelectTrigger>
                        <SelectContent>
                          {meetingDays.map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Status Kehadiran</Label>
                      <Select 
                        value={attendanceData[student.id]?.status || ''} 
                        onValueChange={(value) => updateAttendance(student.id, 'status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hadir">Hadir</SelectItem>
                          <SelectItem value="izin">Izin</SelectItem>
                          <SelectItem value="sakit">Sakit</SelectItem>
                          <SelectItem value="tidak_ada_keterangan">Tidak Ada Keterangan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Mata Pelajaran</Label>
                      <Select 
                        value={attendanceData[student.id]?.subject || ''} 
                        onValueChange={(value) => updateAttendance(student.id, 'subject', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih mata pelajaran" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Nilai (opsional)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0-100"
                        value={attendanceData[student.id]?.grade || ''}
                        onChange={(e) => updateAttendance(student.id, 'grade', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>

                    <div className="lg:col-span-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Checkbox
                          id={`late-${student.id}`}
                          checked={attendanceData[student.id]?.isLate || false}
                          onCheckedChange={(checked) => updateAttendance(student.id, 'isLate', checked)}
                        />
                        <Label htmlFor={`late-${student.id}`} className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Terlambat
                        </Label>
                      </div>
                      
                      {attendanceData[student.id]?.isLate && (
                        <div className="ml-6 mb-3">
                          <Label>Menit Keterlambatan</Label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Masukkan menit"
                            className="w-32"
                            value={attendanceData[student.id]?.lateMinutes || ''}
                            onChange={(e) => updateAttendance(student.id, 'lateMinutes', e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </div>
                      )}

                      <div>
                        <Label>Catatan</Label>
                        <Textarea
                          placeholder="Catatan tambahan..."
                          value={attendanceData[student.id]?.notes || ''}
                          onChange={(e) => updateAttendance(student.id, 'notes', e.target.value)}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Presensi;