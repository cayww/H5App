import React from 'react'
import emptyImage from '@/assets/empty.png'

export default function Empty({ text = 'NO Data' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        src={emptyImage}
        alt="empty"
        style={{
          width: 'calc(100vw * 118 / 375)',
          height: 'calc(100vw * 118 / 375)',
        }}
      />
      <div
        style={{
          marginTop: 'calc(100vh * 38 / 812)',
          fontFamily: 'Archivo, sans-serif',
          fontSize: 'calc(100vw * 16 / 375)',
          fontWeight: 400,
          lineHeight: 'calc(100vw * 17.41 / 375)',
          color: '#fff',
        }}
      >
        {text}
      </div>
    </div>
  )
}

