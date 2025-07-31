'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('❌ Lỗi xảy ra:', error);
  }, [error]);

  return (
    <div
      style={{
        padding: '3rem',
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2rem', color: '#e11d48' }}>⚠️ Đã xảy ra lỗi</h1>
      <p style={{ margin: '1rem 0', color: '#555' }}>
        Rất tiếc, đã xảy ra lỗi trong quá trình tải trang.
      </p>
      <button
        onClick={() => reset()}
        style={{
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Thử lại
      </button>
    </div>
  );
}
