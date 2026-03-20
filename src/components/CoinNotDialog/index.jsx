import React from 'react'
import coinNotBg from '@/assets/coinnot.png'
import './index.css'

export default function CoinNotDialog({ onRecharge }) {
  return (
    <div className="coin-dialog" style={{ backgroundImage: `url(${coinNotBg})` }}>
      <button type="button" className="coin-dialog-btn" onClick={onRecharge}>
        Recharge
      </button>
    </div>
  )
}
