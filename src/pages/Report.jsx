import React, { useState, useEffect } from 'react';
import { PieChart, Download, CheckCircle, XCircle, BookOpen } from 'lucide-react';

const Report = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/report/progress')
      .then(res => res.json())
      .then(data => setProgressData(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = () => {
    alert("กำลังสร้างไฟล์ Excel (.xlsx) เพื่อเตรียมส่งออกข้อมูล...");
  };

  const filteredData = selectedCourse === 'all' 
    ? progressData 
    : progressData.filter(c => c.course_id.toString() === selectedCourse);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={24} color="var(--primary)" />
            สรุปความคืบหน้า (Progress Report)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            ติดตามการนำส่งหลักฐาน AUN-QA แยกตามหลักสูตร
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <BookOpen size={18} color="var(--primary)" />
            <select 
              className="input-field" 
              style={{ padding: '0.25rem', border: 'none', background: 'transparent', minWidth: '200px' }}
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="all" style={{ color: '#000' }}>-- ดูรวมทุกหลักสูตร --</option>
              {progressData.map(c => (
                <option key={c.course_id} value={c.course_id} style={{ color: '#000' }}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-primary" onClick={handleExport}>
            <Download size={18} />
            ส่งออกรายงาน (Export)
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>กำลังโหลดข้อมูล...</p>
      ) : progressData.length === 0 ? (
        <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          ไม่พบข้อมูลหลักสูตรในระบบ
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredData.map(course => (
            <div key={course.course_id} className="glass" style={{ padding: '1.5rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{course.course_name}</h3>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: course.progress === 100 ? 'var(--success)' : 'var(--primary)' }}>
                  {course.progress}%
                </span>
              </div>

              {/* Progress Bar Background */}
              <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                {/* Progress Bar Fill */}
                <div style={{ 
                  height: '100%', 
                  width: `${course.progress}%`, 
                  background: course.progress === 100 ? 'var(--success)' : 'var(--primary)',
                  transition: 'width 1s ease-in-out'
                }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {course.details.map((detail, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    padding: '0.75rem 1rem', 
                    borderRadius: 'var(--radius-sm)',
                    background: detail.is_completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                    color: detail.is_completed ? 'var(--success)' : 'var(--text-muted)',
                    fontSize: '0.85rem'
                  }}>
                    {detail.is_completed ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>ข้อ {detail.criteria_no}</span>
                      <span style={{ opacity: 0.8, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                        {detail.criteria_name}
                      </span>
                    </div>
                  </div>
                ))}
                {course.details.length === 0 && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>ยังไม่ได้ตั้งค่าเกณฑ์ให้หลักสูตรนี้</span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Report;
