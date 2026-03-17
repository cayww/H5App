import React from 'react'
import moreImage from '@/assets/more.png'

export default function MoreButton({ onClick, className, style }) {
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
      onClick={onClick}
      aria-label="More"
    >
      <span
        aria-hidden="true"
        style={{
          width: 'calc(100vw * 32 / 375)',
          height: 'calc(100vw * 32 / 375)',
          backgroundImage: `url(${moreImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'block',
        }}
      />
    </button>
  )
}

