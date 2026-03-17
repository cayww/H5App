import React from 'react'
import { goBackOrClose } from '@/utils/iosBridge'
import backImage from '@/assets/back.png'

export default function BackButton({ className, style }) {
  return (
    <button
      type="button"
      className={className}
      style={{
        width: 'calc(100vw * 40 / 375)',
        height: 'calc(100vw * 40 / 375)',
        borderRadius: 'calc(100vw * 14 / 375)',
        background: '#fff',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      onClick={goBackOrClose}
      aria-label="Back"
    >
      <span
        aria-hidden="true"
        style={{
          width: 'calc(100vw * 30 / 375)',
          height: 'calc(100vw * 30 / 375)',
          backgroundImage: `url(${backImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'block',
        }}
      />
    </button>
  )
}

