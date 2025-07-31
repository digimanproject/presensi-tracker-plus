import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AttendanceRecord } from '@/types/attendance';
import { MOCK_CLASSES } from '@/data/mockData';
import { Search, Filter, FileText, Clock, Users } from 'lucide-react';

const DataPresensi = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');

  useEffect(() => {
    const loadRecords = () => {
      const savedRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      setRecords(savedRecords);
      setFilteredRecords(savedRecords);
    };

    loadRecords();
    
    // Refresh every 5 seconds for real-time feel
    const interval = setInterval(loadRecords, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = records;

    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    if (classFilter !== 'all') {
      filtered = filtered.filter(record => record.classId === classFilter);
    }

    setFilteredRecords(filtered);
  }, [records, searchTerm, statusFilter, classFilter]);

  const getStatusBadge = (status: string, isLate: boolean) => {
    if (isLate && status === 'hadir') {
      return <Badge variant="destructive">Terlambat</Badge>;
    }
    
    switch (status) {
      case 'hadir':
        return <Badge className="bg-success text-success-foreground">Hadir</Badge>;
      case 'izin':
        return <Badge className="bg-warning text-warning-foreground">Izin</Badge>;
      case 'sakit':
        return <Badge className="bg-info text-info-foreground">Sakit</Badge>;
      case 'tidak_ada_keterangan':
        return <Badge variant="destructive">Tanpa Keterangan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: records.length,
    hadir: records.filter(r => r.status === 'hadir').length,
    izin: records.filter(r => r.status === 'izin').length,
    sakit: records.filter(r => r.status === 'sakit').length,
    alpha: records.filter(r => r.status === 'tidak_ada_keterangan').length,
    terlambat: records.filter(r => r.isLate).length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Presensi</h1>
          <p className="text-muted-foreground">Pantau data kehadiran siswa secara real-time</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString('id-ID')}</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Record</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{stats.hadir}</div>
            <div className="text-xs text-muted-foreground">Hadir</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.izin}</div>
            <div className="text-xs text-muted-foreground">Izin</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-info">{stats.sakit}</div>
            <div className="text-xs text-muted-foreground">Sakit</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{stats.alpha}</div>
            <div className="text-xs text-muted-foreground">Alpha</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{stats.terlambat}</div>
            <div className="text-xs text-muted-foreground">Terlambat</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama siswa, kelas, atau mata pelajaran..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="hadir">Hadir</SelectItem>
                <SelectItem value="izin">Izin</SelectItem>
                <SelectItem value="sakit">Sakit</SelectItem>
                <SelectItem value="tidak_ada_keterangan">Tanpa Keterangan</SelectItem>
              </SelectContent>
            </Select>

            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {MOCK_CLASSES.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Data Presensi ({filteredRecords.length} record)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length > 0 ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Hari</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Mata Pelajaran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map(record => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.date).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{record.meetingDay}</TableCell>
                      <TableCell className="font-medium">{record.studentName}</TableCell>
                      <TableCell>{record.className}</TableCell>
                      <TableCell>{record.subject}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(record.status, record.isLate)}
                          {record.isLate && record.lateMinutes && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {record.lateMinutes} menit
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.grade ? (
                          <Badge variant="outline">{record.grade}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.notes ? (
                          <div className="max-w-xs truncate text-sm" title={record.notes}>
                            {record.notes}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {records.length === 0 ? (
                <div>
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada data presensi.</p>
                  <p className="text-sm">Silakan tambahkan presensi dari halaman Presensi.</p>
                </div>
              ) : (
                <div>
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Tidak ada data yang sesuai dengan filter.</p>
                  <p className="text-sm">Coba ubah kriteria pencarian atau filter.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPresensi;