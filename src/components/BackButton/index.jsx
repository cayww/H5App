import React from 'react'
import { goBackOrClose } from '@/utils/iosBridge'
import './index.css'

export default function BackButton({ className = '', style }) {
  return (
    <button
      type="button"
      className={`back-button ${className}`}
      style={style}
      onClick={goBackOrClose}
      aria-label="Back"
    >
      <span className="back-button-icon" aria-hidden="true" />
    </button>
  )
}
