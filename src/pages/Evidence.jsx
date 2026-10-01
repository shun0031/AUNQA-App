import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Clock, History } from 'lucide-react';

const Evidence = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [criteriaId, setCriteriaId] = useState('');
  
  const [courses, setCourses] = useState([]);
  const [criteriaList, setCriteriaList] = useState([]);
  const [myHistory, setMyHistory] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const user = JSON.parse(localStorage.getItem('aunqa_user'));

  const fetchMyHistory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/evidence?user_id=${user.id}`);
      const data = await res.json();
      setMyHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    // Fetch courses and criteria from API
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        if (data.length > 0) {
          setCourseId(data[0].id);
          setCriteriaList(data[0].criteria);
          if (data[0].criteria.length > 0) {
            setCriteriaId(data[0].criteria[0].id);
          }
        }
      })
      .catch(err => console.error('Error fetching courses:', err));

    fetchMyHistory();
  }, []);

  const handleCourseChange = (e) => {
    const selectedCourseId = parseInt(e.target.value);
    setCourseId(selectedCourseId);
    
    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    if (selectedCourse) {
      setCriteriaList(selectedCourse.criteria);
      if (selectedCourse.criteria.length > 0) {
        setCriteriaId(selectedCourse.criteria[0].id);
      } else {
        setCriteriaId('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId || !criteriaId) {
      setMessage({ type: 'error', text: 'กรุณาเลือกหลักสูตรและเกณฑ์การประเมิน' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('academic_year', '2567');
    formData.append('description', description);
    formData.append('course_id', courseId);
    formData.append('criteria_id', criteriaId);
    formData.append('user_id', user.id);
    formData.append('evidence_type', file ? 'file' : 'text');
    
    if (file) {
      formData.append('file', file);
    }

    try {
      const res = await fetch('http://localhost:5000/api/evidence', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'อัปโหลดหลักฐานสำเร็จ!' });
        setFile(null);
        setDescription('');
        fetchMyHistory(); // Refresh history table
      } else {
        setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการอัปโหลด' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={24} color="var(--primary)" />
          แนบและจัดการหลักฐาน (AUN-QA Version 4.0)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          อัปโหลดไฟล์เอกสาร รูปภาพ หรือลิงก์ที่เกี่ยวข้องกับเกณฑ์ AUN-QA
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Upload Form */}
        <div className="glass" style={{ padding: '2rem', flex: '1 1 400px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UploadCloud size={20} color="var(--primary)"/>
            ฟอร์มนำส่งหลักฐาน
          </h3>

          {message && (
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>เลือกหลักสูตร</label>
                <select className="input-field" value={courseId} onChange={handleCourseChange} required>
                  <option value="" disabled>-- เลือกหลักสูตร --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.course_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>หัวเกณฑ์ประเมิน AUN-QA</label>
              <select className="input-field" value={criteriaId} onChange={e => setCriteriaId(e.target.value)} required>
                <option value="" disabled>-- เลือกเกณฑ์ --</option>
                {criteriaList.map(cr => (
                  <option key={cr.id} value={cr.id}>
                    AUN-QA {cr.criteria_no} : {cr.description} ({cr.criteria_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>คำอธิบายหลักฐาน</label>
              <textarea 
                className="input-field" 
                rows="4" 
                placeholder="อธิบายรายละเอียดของหลักฐานชิ้นนี้..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>แนบไฟล์</label>
              <div style={{
                border: '2px dashed var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.02)'
              }}>
                <UploadCloud size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</p>
                <input 
                  type="file" 
                  style={{ width: '100%', marginTop: '1rem' }} 
                  onChange={e => setFile(e.target.files[0])}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'กำลังอัปโหลด...' : 'ยืนยันการนำส่งหลักฐาน'}
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="glass" style={{ padding: '2rem', flex: '1 1 500px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={20} color="var(--accent)"/>
            ประวัติการนำส่งหลักฐานของคุณ
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>รายละเอียด</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>สถานะ</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>ความคิดเห็นผู้ตรวจ</th>
                </tr>
              </thead>
              <tbody>
                {myHistory.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600 }}>{r.course?.course_name}</span><br/>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>เกณฑ์ AUN-QA {r.criteria?.criteria_no}</span>
                    </td>
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
                        {r.status === 'approved' ? 'ผ่าน' : r.status === 'returned' ? 'ส่งกลับแก้ไข' : 'รอตรวจ'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {r.review_comment ? `"${r.review_comment}"` : '-'}
                    </td>
                  </tr>
                ))}
                {myHistory.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>คุณยังไม่เคยนำส่งหลักฐาน</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Evidence;
