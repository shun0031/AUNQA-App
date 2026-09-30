import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, LogOut, BookOpen, CheckCircle, PieChart, User } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
  <Link 
    to={path}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      color: active ? 'white' : 'var(--text-muted)',
      background: active ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
      borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
      transition: 'var(--transition)',
      textDecoration: 'none'
    }}
  >
    <Icon size={20} color={active ? 'var(--primary)' : 'currentColor'} />
    <span style={{ fontWeight: active ? 600 : 500, fontSize: '0.9rem' }}>{label}</span>
  </Link>
);

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('aunqa_token');
    const userData = localStorage.getItem('aunqa_user');
    
    if (!token || !userData) {
      navigate('/');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('aunqa_token');
    localStorage.removeItem('aunqa_user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="glass" style={{
        width: '260px',
        margin: '1rem',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ padding: '0 1rem' }}>
          <h2 className="heading" style={{ fontSize: '1.25rem' }}>AUN-QA</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem', textTransform: 'capitalize' }}>
            พอร์ทัล {user.role}
          </p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <SidebarItem icon={LayoutDashboard} label="ภาพรวมระบบ" path="/dashboard" active={location.pathname === '/dashboard'} />
          
          {(user.role === 'admin' || user.role === 'aun-qa') && (
            <SidebarItem icon={BookOpen} label="หลักสูตรและเกณฑ์" path="/dashboard/courses" active={location.pathname === '/dashboard/courses'} />
          )}
          
          <SidebarItem icon={FileText} label="แนบและจัดการหลักฐาน" path="/dashboard/evidence" active={location.pathname === '/dashboard/evidence'} />
          
          {(user.role === 'admin' || user.role === 'aun-qa') && (
            <SidebarItem icon={CheckCircle} label="ตรวจสอบและยืนยัน" path="/dashboard/review" active={location.pathname === '/dashboard/review'} />
          )}

          {(user.role === 'admin' || user.role === 'aun-qa') && (
            <SidebarItem icon={PieChart} label="สรุปความคืบหน้า" path="/dashboard/report" active={location.pathname === '/dashboard/report'} />
          )}

          <SidebarItem icon={User} label="โปรไฟล์ส่วนตัว" path="/dashboard/profile" active={location.pathname === '/dashboard/profile'} />

          {user.role === 'admin' && (
            <>
              <SidebarItem icon={Users} label="จัดการผู้ใช้งาน" path="/dashboard/users" active={location.pathname === '/dashboard/users'} />
              <SidebarItem icon={Settings} label="ตั้งค่าระบบ" path="/dashboard/settings" active={location.pathname === '/dashboard/settings'} />
            </>
          )}
        </nav>

        <div 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            color: 'var(--danger)',
            transition: 'var(--transition)'
          }}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>ออกจากระบบ</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem' 
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>ภาพรวมระบบ</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ยินดีต้อนรับกลับสู่ระบบจัดการ AUN-QA</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.username}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user.role}</p>
            </div>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              textTransform: 'uppercase',
              overflow: 'hidden'
            }}>
              {user.profile_picture ? (
                <img src={`http://localhost:5000/${user.profile_picture}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user.username.charAt(0)
              )}
            </div>
          </div>
        </header>
        
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
