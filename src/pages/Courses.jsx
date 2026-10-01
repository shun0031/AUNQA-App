import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Settings, X, List } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/courses');
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_name: newCourseName })
      });
      setShowModal(false);
      setNewCourseName('');
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCriteria = (course) => {
    setSelectedCourse(course);
    setShowCriteriaModal(true);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={24} color="var(--primary)" />
            หลักสูตรและเกณฑ์การประเมิน
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            จัดการข้อมูลหลักสูตรที่เปิดสอนและตรวจสอบหัวข้อเกณฑ์ AUN-QA ที่เกี่ยวข้อง
          </p>
        </div>
        
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          เพิ่มหลักสูตรใหม่
        </button>
      </div>

      <div className="glass" style={{ padding: '1.5rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>กำลังโหลดข้อมูล...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>รหัสหลักสูตร</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>ชื่อหลักสูตร</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>ภาควิชา</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem', textAlign: 'center' }}>จำนวนเกณฑ์ที่ใช้</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem', textAlign: 'center' }}>สถานะ</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem', textAlign: 'right' }}>ตั้งค่าเกณฑ์</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>COURSE-{c.id.toString().padStart(3, '0')}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{c.course_name}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{c.department?.department_name}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
                      <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {c.criteria?.length || 0} ข้อ
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: c.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: c.status === 'active' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {c.status === 'active' ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button className="btn-secondary" style={{ padding: '0.5rem' }} onClick={() => handleOpenCriteria(c)}>
                        <List size={16} /> ดูเกณฑ์
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>เพิ่มหลักสูตรใหม่</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                className="input-field" 
                placeholder="ชื่อหลักสูตร (เช่น วิศวกรรมซอฟต์แวร์)" 
                required
                value={newCourseName} 
                onChange={e => setNewCourseName(e.target.value)} 
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>ยกเลิก</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>บันทึกหลักสูตร</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Criteria Modal */}
      {showCriteriaModal && selectedCourse && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '800px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>เกณฑ์ประเมิน: {selectedCourse.course_name}</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    const newNo = selectedCourse.criteria ? (selectedCourse.criteria.length + 1).toString() : "1";
                    const newCrit = { isNew: true, criteria_no: newNo, criteria_name: '', description: '', academic_year: '2568' };
                    setSelectedCourse({ ...selectedCourse, criteria: [...(selectedCourse.criteria || []), newCrit] });
                  }}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                >
                  <Plus size={16} /> เพิ่มเกณฑ์ใหม่
                </button>
                <button onClick={() => setShowCriteriaModal(false)} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>
            </div>
            
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
              {selectedCourse.criteria && selectedCourse.criteria.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedCourse.criteria.map((cr, idx) => (
                    <li key={cr.id || idx} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                      {cr.isEditing || cr.isNew ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: '1' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>ข้อที่</label>
                              <input className="input-field" value={cr.criteria_no} onChange={e => {
                                const newC = [...selectedCourse.criteria];
                                newC[idx].criteria_no = e.target.value;
                                setSelectedCourse({ ...selectedCourse, criteria: newC });
                              }} />
                            </div>
                            <div style={{ flex: '3' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>ชื่อย่อ (Short Name)</label>
                              <input className="input-field" value={cr.criteria_name} placeholder="เช่น ELO" onChange={e => {
                                const newC = [...selectedCourse.criteria];
                                newC[idx].criteria_name = e.target.value;
                                setSelectedCourse({ ...selectedCourse, criteria: newC });
                              }} />
                            </div>
                            <div style={{ flex: '2' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>ปีการศึกษา</label>
                              <input className="input-field" value={cr.academic_year} onChange={e => {
                                const newC = [...selectedCourse.criteria];
                                newC[idx].academic_year = e.target.value;
                                setSelectedCourse({ ...selectedCourse, criteria: newC });
                              }} />
                            </div>
                          </div>
                          <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>รายละเอียดเกณฑ์แบบเต็ม</label>
                            <input className="input-field" value={cr.description || ''} placeholder="เช่น ผลการเรียนรู้ที่คาดหวัง" onChange={e => {
                              const newC = [...selectedCourse.criteria];
                              newC[idx].description = e.target.value;
                              setSelectedCourse({ ...selectedCourse, criteria: newC });
                            }} />
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                            <button className="btn-secondary" style={{ padding: '0.4rem 1rem' }} onClick={() => {
                              if (cr.isNew) {
                                const newC = selectedCourse.criteria.filter((_, i) => i !== idx);
                                setSelectedCourse({ ...selectedCourse, criteria: newC });
                              } else {
                                fetchCourses(); // Refresh to undo
                                setShowCriteriaModal(false);
                              }
                            }}>ยกเลิก</button>
                            <button className="btn-primary" style={{ padding: '0.4rem 1rem' }} onClick={async () => {
                              const method = cr.isNew ? 'POST' : 'PUT';
                              const url = cr.isNew ? `http://localhost:5000/api/courses/${selectedCourse.id}/criteria` : `http://localhost:5000/api/courses/criteria/${cr.id}`;
                              await fetch(url, {
                                method, headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ criteria_no: cr.criteria_no, criteria_name: cr.criteria_name, description: cr.description, academic_year: cr.academic_year })
                              });
                              fetchCourses();
                              setShowCriteriaModal(false);
                            }}>บันทึก</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.25rem' }}>
                            <div style={{ fontWeight: 600, color: 'var(--accent)', marginBottom: '0.25rem' }}>เกณฑ์ข้อที่ {cr.criteria_no} (ปีการศึกษา {cr.academic_year})</div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '-0.25rem' }}>
                              <button style={{ color: 'var(--accent)', background: 'none', fontSize: '0.8rem', textDecoration: 'underline' }} onClick={() => {
                                const newC = [...selectedCourse.criteria];
                                newC[idx].isEditing = true;
                                setSelectedCourse({ ...selectedCourse, criteria: newC });
                              }}>แก้ไข</button>
                              <button style={{ color: 'var(--danger)', background: 'none', fontSize: '0.8rem', textDecoration: 'underline' }} onClick={async () => {
                                if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเกณฑ์ข้อนี้? ข้อมูลหลักฐานที่เกี่ยวข้องอาจได้รับผลกระทบ')) {
                                  await fetch(`http://localhost:5000/api/courses/criteria/${cr.id}`, { method: 'DELETE' });
                                  fetchCourses();
                                  setShowCriteriaModal(false);
                                }
                              }}>ลบ</button>
                            </div>
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.5rem' }}>{cr.description}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>ชื่อย่อ: {cr.criteria_name}</div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '3rem 0', gap: '1rem' }}>
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>หลักสูตรนี้ยังไม่ได้กำหนดเกณฑ์</p>
                  <button 
                    className="btn-primary" 
                    onClick={async () => {
                      try {
                        await fetch(`http://localhost:5000/api/courses/${selectedCourse.id}/generate-criteria`, { method: 'POST' });
                        setShowCriteriaModal(false);
                        fetchCourses();
                      } catch (err) { console.error(err); }
                    }}
                  >
                    <Plus size={18} /> สร้างเกณฑ์ AUN-QA Version 4.0 อัตโนมัติ (8 ข้อ)
                  </button>
                </div>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowCriteriaModal(false)}>ปิด</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Courses;
