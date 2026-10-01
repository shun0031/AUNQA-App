import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Plus, Edit2, Trash2, X } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({ 
    username: '', password: '', full_name: '', email: '', phone: '', line_id: '', address: '', role_name: 'teacher', status: 'active' 
  });

  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ username: '', password: '', full_name: '', email: '', phone: '', line_id: '', address: '', role_name: 'teacher', status: 'active' });
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setIsEditing(true);
    setEditId(user.id);
    setFormData({
      username: user.username,
      password: '', // Don't show password
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || '',
      line_id: user.line_id || '',
      address: user.address || '',
      role_name: user.role?.role_name || 'teacher',
      status: user.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm('คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?')) {
      try {
        await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await fetch(`http://localhost:5000/api/users/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UsersIcon size={24} color="var(--primary)" />
            จัดการผู้ใช้งาน
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            เพิ่ม ลบ และแก้ไขข้อมูลผู้ใช้งานทั้งหมดในระบบ
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            className="input-field" 
            placeholder="ค้นหาชื่อ, รหัส..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '250px' }}
          />
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            เพิ่มผู้ใช้ใหม่
          </button>
        </div>
      </div>

      <div className="glass" style={{ padding: '1.5rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>กำลังโหลดข้อมูล...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>ข้อมูลผู้ใช้งาน</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>อีเมล / เบอร์โทร</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>บทบาท (Role)</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>สถานะ</th>
                  <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem', textAlign: 'right' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                        color: 'var(--primary)', fontWeight: 600, border: '1px solid var(--glass-border)'
                      }}>
                        {u.profile_picture ? (
                          <img src={`http://localhost:5000/${u.profile_picture}`} alt={u.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          u.username.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{u.full_name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{u.username}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                      <div>{u.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.phone || '-'}</div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', textTransform: 'capitalize' }}>{u.role?.role_name}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: u.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: u.status === 'active' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {u.status === 'active' ? 'ใช้งานปกติ' : 'ถูกระงับ'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn-secondary" style={{ padding: '0.5rem' }} onClick={() => handleOpenEdit(u)}><Edit2 size={16} /></button>
                        <button className="btn-secondary" style={{ padding: '0.5rem', color: 'var(--danger)' }} onClick={() => handleDelete(u.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{isEditing ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input className="input-field" placeholder="ชื่อผู้ใช้งาน (Username)" required disabled={isEditing}
                value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              
              {!isEditing && (
                <input className="input-field" type="password" placeholder="รหัสผ่าน" required
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              )}
              
              <input className="input-field" placeholder="ชื่อ-นามสกุล" required
                value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
              <input className="input-field" type="email" placeholder="อีเมล" required
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input className="input-field" style={{ flex: 1 }} placeholder="เบอร์โทรศัพท์"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <input className="input-field" style={{ flex: 1 }} placeholder="Line ID"
                  value={formData.line_id} onChange={e => setFormData({...formData, line_id: e.target.value})} />
              </div>
              
              <textarea className="input-field" rows="2" placeholder="ที่อยู่ / ข้อมูลติดต่อ"
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              
              <select className="input-field" value={formData.role_name} onChange={e => setFormData({...formData, role_name: e.target.value})}>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher (อาจารย์)</option>
                <option value="aun-qa">AUN-QA</option>
              </select>

              {isEditing && (
                <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="active">ใช้งานปกติ (Active)</option>
                  <option value="inactive">ระงับการใช้งาน (Inactive)</option>
                </select>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>ยกเลิก</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
