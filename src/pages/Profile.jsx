import React, { useState, useEffect } from 'react';
import { User, Save, CheckCircle, AlertCircle, Camera } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', phone: '', line_id: '', address: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('aunqa_user'));
    if (currentUser) {
      setUser(currentUser);
      
      fetch(`http://localhost:5000/api/users`)
        .then(res => res.json())
        .then(data => {
          const myData = data.find(u => u.id === currentUser.id);
          if (myData) {
            setFormData({
              full_name: myData.full_name || '',
              email: myData.email || '',
              phone: myData.phone || '',
              line_id: myData.line_id || '',
              address: myData.address || '',
              password: ''
            });
            if (myData.profile_picture) {
              setPreview(`http://localhost:5000/${myData.profile_picture}`);
            }
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const submitData = new FormData();
    submitData.append('full_name', formData.full_name);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('line_id', formData.line_id);
    submitData.append('address', formData.address);
    if (formData.password) submitData.append('password', formData.password);
    if (profilePicture) submitData.append('profile_picture', profilePicture);

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        body: submitData
      });
      
      if (res.ok) {
        const updatedUser = await res.json();
        
        const currentData = JSON.parse(localStorage.getItem('aunqa_user'));
        localStorage.setItem('aunqa_user', JSON.stringify({
          ...currentData,
          full_name: updatedUser.full_name,
          profile_picture: updatedUser.profile_picture
        }));

        setMessage({ type: 'success', text: 'บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว' });
        setFormData({ ...formData, password: '' }); 
        
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>กำลังโหลด...</p>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={24} color="var(--primary)" />
          โปรไฟล์ส่วนตัว
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          แก้ไขข้อมูลส่วนตัวและรหัสผ่านของคุณ
        </p>
      </div>

      <div className="glass" style={{ padding: '2rem', maxWidth: '500px' }}>
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
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-light)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              border: '2px solid var(--primary)', position: 'relative', marginBottom: '1rem'
            }}>
              {preview ? (
                <img src={preview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={40} color="var(--text-muted)" />
              )}
            </div>
            <label style={{ cursor: 'pointer', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={16} /> อัปโหลดรูปโปรไฟล์
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            </label>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>ชื่อผู้ใช้งาน (Username)</label>
            <input className="input-field" value={user.username} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>บทบาท (Role)</label>
            <input className="input-field" value={user.role} disabled style={{ opacity: 0.7, cursor: 'not-allowed', textTransform: 'capitalize' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>ชื่อ-นามสกุล</label>
            <input 
              className="input-field" 
              required
              value={formData.full_name} 
              onChange={e => setFormData({...formData, full_name: e.target.value})} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>อีเมล</label>
            <input 
              className="input-field" 
              type="email"
              required
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>เบอร์โทรศัพท์</label>
              <input 
                className="input-field" 
                placeholder="08x-xxx-xxxx"
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>Line ID</label>
              <input 
                className="input-field" 
                placeholder="Line ID"
                value={formData.line_id} 
                onChange={e => setFormData({...formData, line_id: e.target.value})} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>ที่อยู่ / ข้อมูลติดต่อเพิ่มเติม</label>
            <textarea 
              className="input-field" 
              rows="3"
              placeholder="ระบุที่อยู่หรือข้อมูลการติดต่ออื่นๆ..."
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
            />
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>เปลี่ยนรหัสผ่านใหม่ <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>(ปล่อยว่างไว้หากไม่ต้องการเปลี่ยน)</span></label>
            <input 
              className="input-field" 
              type="password"
              placeholder="กรอกรหัสผ่านใหม่..."
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'กำลังบันทึก...' : <><Save size={18} /> บันทึกข้อมูล</>}
          </button>
        </form>
      </div>

    </div>
  );
};

export default Profile;
