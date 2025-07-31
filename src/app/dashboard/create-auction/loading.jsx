'use client';

export default function Loading() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        fontSize: '1.5rem',
        color: '#0070f3',
        backgroundColor: '#f9f9f9',
        flexDirection: 'column',
      }}
    >
      <div className="spinner" />
      <p>Đang tải nội dung...</p>

      <style jsx>{`
        .spinner {
          width: 48px;
          height: 48px;
          margin-bottom: 1rem;
          border: 5px solid #e0e0e0;
          border-top: 5px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
