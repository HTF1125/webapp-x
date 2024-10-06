import { CSSProperties } from 'react'

const spinnerStyle: CSSProperties = {
  border: '4px solid rgba(0, 0, 0, 0.1)',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  borderLeftColor: '#09f',
  animation: 'spin 1s linear infinite',
}

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <div style={spinnerStyle}></div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}