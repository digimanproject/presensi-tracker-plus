import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_CLASSES } from '@/data/mockData';
import { Users, User } from 'lucide-react';

const Kelas = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Daftar Kelas</h1>
        <p className="text-muted-foreground">Kelola kelas dan daftar siswa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CLASSES.map(classData => (
          <Card key={classData.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {classData.name}
                </span>
                <Badge variant="secondary">
                  {classData.students.length} siswa
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Daftar Siswa:</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {classData.students.map((student, index) => (
                    <div key={student.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {index + 1}. {student.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{MOCK_CLASSES.length}</div>
              <div className="text-sm text-muted-foreground">Total Kelas</div>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">
                {MOCK_CLASSES.reduce((total, cls) => total + cls.students.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Siswa</div>
            </div>
            <div className="text-center p-4 bg-info/10 rounded-lg">
              <div className="text-2xl font-bold text-info">15</div>
              <div className="text-sm text-muted-foreground">Rata-rata Siswa per Kelas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Kelas;