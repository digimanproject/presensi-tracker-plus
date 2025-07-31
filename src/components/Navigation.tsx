import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { GraduationCap, Users, FileText, ClipboardList, UserCog } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: GraduationCap },
    { path: '/presensi', label: 'Presensi', icon: ClipboardList },
    { path: '/kelas', label: 'Kelas', icon: Users },
    { path: '/data-siswa', label: 'Data Siswa', icon: UserCog },
    { path: '/data-presensi', label: 'Data Presensi', icon: FileText },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-foreground">Presensi Sekolah</span>
            </div>
          </div>
          
          <div className="flex space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200",
                  location.pathname === path
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;