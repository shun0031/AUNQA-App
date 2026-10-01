import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Search, Filter } from 'lucide-react';

const Review = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [comment, setComment] = useState('');

  // Filters
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [courses, setCourses] = useState([]);

  const user = JSON.parse(localStorage.getItem('aunqa_user'));

  const fetchRecords = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/evidence');
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/courses');
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchCourses();
  }, []);

  const handleUpdateStatus = async (status) => {
    if (!selectedRecord) return;
    try {
      await fetch(`http://localhost:5000/api/evidence/${selectedRecord.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          review_comment: comment,
          reviewer_id: user.id
        })
      });
      setSelectedRecord(null);
      setComment('');
      fetchRecords(); // Refresh data
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRecords = records.filter(r => {
    if (filterCourse && r.course_id.toString() !== filterCourse) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={24} color="var(--primary)" />
          ตรวจสอบและยืนยันหลักฐาน (Review & Approve)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          ผู้รับผิดชอบและคณะกรรมการ AUN-QA ตรวจสอบความถูกต้องและประเมินหลักฐาน
        </p>
      </div>

      {/* Filter Section */}
      <div className="glass" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <Filter size={18} /> <span style={{ fontWeight: 500 }}>ตัวกรอง:</span>
        </div>
        
        <select 
          className="input-field" 
          style={{ padding: '0.5rem 1rem', width: 'auto', minWidth: '200px' }}
          value={filterCourse} 
          onChange={e => setFilterCourse(e.target.value)}
        >
          <option value="">-- ทุกหลักสูตร --</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.course_name}</option>
          ))}
        </select>

        <select 
          className="input-field" 
          style={{ padding: '0.5rem 1rem', width: 'auto' }}
          value={filterStatus} 
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">-- ทุกสถานะ --</option>
          <option value="draft">รอตรวจ (Draft)</option>
          <option value="approved">ผ่าน (Approved)</option>
          <option value="returned">ส่งกลับ (Returned)</option>
        </select>
      </div>

      <div className="glass" style={{ padding: '1.5rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>กำลังโหลดข้อมูล...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>รหัส / หลักสูตร</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>เกณฑ์ AUN-QA</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>รายละเอียด</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>ผู้ส่ง</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>สถานะ</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem', textAlign: 'right' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600 }}>#{r.id}</span>
                      <br/>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{r.course?.course_name}</span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>ข้อที่ {r.criteria?.criteria_no}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{r.description?.substring(0, 30)}...</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{r.created_by?.full_name}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: r.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 
                                   r.status === 'draft' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: r.status === 'approved' ? 'var(--success)' : 
                               r.status === 'draft' ? 'var(--warning)' : 'var(--danger)'
                      }}>
                        {r.status === 'approved' ? 'ผ่าน' : r.status === 'returned' ? 'ส่งกลับ' : 'รอตรวจ'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                        onClick={() => setSelectedRecord(r)}
                      >
                        <Search size={16} style={{ display: 'inline', marginRight: '4px' }}/> ตรวจสอบ
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>ไม่พบข้อมูลหลักฐานตามเงื่อนไขที่ค้นหา</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRecord && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>พิจารณาหลักฐาน #{selectedRecord.id}</h3>
            
            <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <p><strong>หลักสูตร:</strong> {selectedRecord.course?.course_name}</p>
              <p><strong>เกณฑ์:</strong> {selectedRecord.criteria?.criteria_no} - {selectedRecord.criteria?.criteria_name}</p>
              <p><strong>รายละเอียด:</strong> {selectedRecord.description}</p>
              {selectedRecord.evidences && selectedRecord.evidences.length > 0 && selectedRecord.evidences[0].file && (
                <p><strong>ไฟล์แนบ:</strong> <a href={`http://localhost:5000/${selectedRecord.evidences[0].file.file_path}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{selectedRecord.evidences[0].file.original_name}</a></p>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>ความคิดเห็น (ข้อเสนอแนะให้ปรับปรุง)</label>
              <textarea 
                className="input-field" 
                rows="3" 
                placeholder="ระบุข้อเสนอแนะ หรือเหตุผลที่ให้ผ่าน/ส่งกลับ..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedRecord(null)}>ปิด</button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }} 
                onClick={() => handleUpdateStatus('returned')}
              >
                <XCircle size={18}/> ส่งกลับแก้ไข
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }} 
                onClick={() => handleUpdateStatus('approved')}
              >
                <CheckCircle size={18}/> ให้ผ่าน
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Review;
