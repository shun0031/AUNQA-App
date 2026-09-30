import React from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

const Settings = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SettingsIcon size={24} color="var(--primary)" />
          ตั้งค่าระบบ (System Settings)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          ปรับแต่งข้อมูลพื้นฐานของระบบและค่าเริ่มต้นต่างๆ
        </p>
      </div>

      <div className="glass" style={{ padding: '2rem', maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>ข้อมูลสถาบันการศึกษา</h3>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>ชื่อสถาบัน</label>
            <input className="input-field" defaultValue="มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>ปีการศึกษาปัจจุบัน (สำหรับ AUN-QA)</label>
            <input className="input-field" type="number" defaultValue="2568" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>เกณฑ์คุณภาพที่ใช้ปัจจุบัน</label>
            <select className="input-field" defaultValue="v4">
              <option value="v3">AUN-QA Version 3.0</option>
              <option value="v4">AUN-QA Version 4.0</option>
            </select>
          </div>
          <button type="button" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Save size={18} /> บันทึกการตั้งค่า
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
