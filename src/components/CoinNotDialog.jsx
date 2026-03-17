import React from 'react'
import coinNotBg from '@/assets/coinnot.png'

export default function CoinNotDialog({ onRecharge }) {
  return (
    <div
      style={{
        width: 'calc(100vw * 338.5 / 375)',
        height: 'calc(100vh * 391 / 812)',
        backgroundImage: `url(${coinNotBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <button
        type="button"
        onClick={onRecharge}
        style={{
          position: 'absolute',
          bottom: 'calc(100vh * 34 / 812)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100vw * 164 / 375)',
          height: 'calc(100vh * 56 / 812)',
          borderRadius: 'calc(100vw * 40 / 375)',
          background: 'rgba(255, 255, 255, 0.4)',
          boxShadow:
            'inset calc(100vw * 1 / 375) calc(100vw * 1 / 375) calc(100vw * 1 / 375) rgba(255, 255, 255, 0.6), inset calc(100vw * 1 / 375) calc(100vw * 1 / 375) calc(100vw * 1 / 375) rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'YesevaOne, sans-serif',
          fontSize: 'calc(100vw * 20 / 375)',
          fontWeight: 400,
          lineHeight: 'calc(100vw * 23.1 / 375)',
          letterSpacing: 0,
          color: 'rgba(74, 32, 25, 1)',
          border: 'none',
        }}
      >
        Recharge
      </button>
    </div>
  )
}

