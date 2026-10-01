import React, { useState, useEffect } from 'react';
import { FileText, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{title}</p>
      <div style={{ 
        padding: '0.5rem', 
        borderRadius: '50%', 
        background: `rgba(${color}, 0.1)`,
        color: `rgb(${color})`
      }}>
        <Icon size={20} />
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
      <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</h3>
      <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 500 }}>{trend}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState({
    stats: { totalEvidence: 0, pendingReview: 0, approvedRecords: 0, returnedRecords: 0, activeUsers: 0 },
    recent: []
  });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('aunqa_user')) || {};

  useEffect(() => {
    const query = user.role === 'teacher' ? `?user_id=${user.id}` : '';
    fetch(`http://localhost:5000/api/dashboard/stats${query}`)
      .then(res => res.json())
      .then(resData => setData(resData))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const pieData = [
    { name: 'ผ่านแล้ว (Approved)', value: data.stats.approvedRecords, color: '#10b981' },
    { name: 'รอตรวจ (Draft)', value: data.stats.pendingReview, color: '#f59e0b' },
    { name: 'ส่งกลับแก้ไข (Returned)', value: data.stats.returnedRecords, color: '#ef4444' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="หลักฐานทั้งหมด" value={data.stats.totalEvidence} icon={FileText} color="99, 102, 241" trend="ในระบบทั้งหมด" />
        <StatCard title="รอการตรวจสอบ" value={data.stats.pendingReview} icon={AlertCircle} color="245, 158, 11" trend="ต้องดำเนินการ" />
        <StatCard title="อนุมัติแล้ว" value={data.stats.approvedRecords} icon={CheckCircle} color="16, 185, 129" trend="ผ่านเกณฑ์" />
        <StatCard title="ผู้ใช้งานในระบบ" value={data.stats.activeUsers} icon={Users} color="56, 189, 248" trend="ที่ใช้งานอยู่" />
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        
        {/* Circular Dashboard (Pie Chart) */}
        <div className="glass" style={{ padding: '1.5rem', flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600, alignSelf: 'flex-start' }}>สัดส่วนสถานะหลักฐาน</h3>
          {loading ? (
             <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>กำลังโหลดข้อมูล...</p>
          ) : data.stats.totalEvidence === 0 ? (
             <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>ยังไม่มีข้อมูลหลักฐาน</p>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'rgba(30,30,40,0.9)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Activity Table */}
        <div className="glass" style={{ padding: '1.5rem', flex: '2 1 500px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>รายการส่งหลักฐานล่าสุด</h3>
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>กำลังโหลดข้อมูล...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>รหัสหลักฐาน</th>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>หลักสูตร / เกณฑ์</th>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>นำส่งโดย</th>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>วันที่</th>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>{item.id}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.course}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{item.user}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.date}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          background: item.status === 'ผ่าน' ? 'rgba(16, 185, 129, 0.1)' : 
                                    item.status === 'รอตรวจ' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: item.status === 'ผ่าน' ? 'var(--success)' : 
                                item.status === 'รอตรวจ' ? 'var(--warning)' : 'var(--danger)'
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {data.recent.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>ยังไม่มีข้อมูลกิจกรรม</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
