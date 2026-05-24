'use client'

export const dynamic = 'force-dynamic';

export default function GlobalError({ error, reset }) {
    return (
        <html lang="en">
            <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px' }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    minHeight: '100vh',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Something went wrong!</h2>
                    <button 
                        onClick={() => reset()}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4F46E5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
