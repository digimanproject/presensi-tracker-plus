// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  const totalClasses = 10;
  const totalStudents = 150;
  const todayRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]')
    .filter((record: any) => record.date === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Sistem Presensi Sekolah
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Platform digital untuk mengelola presensi siswa dengan mudah dan efisien
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-card rounded-lg p-6 shadow-md border hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">{totalClasses}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Total Kelas</h3>
              <p className="text-muted-foreground text-sm">Kelas yang terdaftar dalam sistem</p>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-md border hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-success">{totalStudents}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Total Siswa</h3>
              <p className="text-muted-foreground text-sm">Siswa aktif di semua kelas</p>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-md border hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="bg-info/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-info">{todayRecords}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Presensi Hari Ini</h3>
              <p className="text-muted-foreground text-sm">Data presensi yang sudah tercatat</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Gunakan menu navigasi di atas untuk mulai mengelola presensi
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
