import React, { useState } from 'react'
import CoinNotDialog from '@/components/CoinNotDialog/index.jsx'
import { useNavigate } from 'react-router-dom'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'
import NavBar from '@/components/NavBar'
import aibgc from '@/assets/pagebgc.png'
import aiusermodel from '@/assets/aiusermodel.png'
import aichatmodel from '@/assets/aichatmodel.png'
import coinIcon from '@/assets/coin.png'

import './index.css'

export default function AiDetails() {
  const nav = useNavigate()
  const ui = useUIStore()
  const currentUser = useCurrentUserStore((s) => s.currentUser)
  const updateUser = useUserStore((s) => s.updateUser)
  const needCoinCount = 200
  const [showCoinNot, setShowCoinNot] = useState(false)

  function handlePurchaseClick() {
    if ((currentUser.coins || 0) >= needCoinCount) {
      if (ui.loading) return
      ui.showLoading()

      const currentCoins = (currentUser.coins || 0) - needCoinCount
      updateUser(currentUser.userId, { coins: currentCoins })

      const delay = Math.floor(Math.random() * 1500) + 500
      setTimeout(() => {
        ui.hideLoading()
        nav('/aiChat')
      }, delay)
    } else {
      setShowCoinNot(true)
    }
  }

  return (
    <div className="ai-container" style={{ backgroundImage: `url(${aibgc})` }}>
      <NavBar />

      <div className="ai-chat-img" style={{ backgroundImage: `url(${aichatmodel})` }} />
      <div className="ai-user-img" style={{ backgroundImage: `url(${aiusermodel})` }} />
      <div className="ai-content">
        <div className="ai-card">
          <div className="ai-desc">
            Hello! I’m Tenao AI, your yoga companion, here to guide you on your journey toward
            mind-body balance and strength. Whether you enjoy gentle flows, challenging poses, or
            deep stretches, I’m here to share tips, plan sessions, and keep your yoga practice fun
            and motivating. Ready to relax, find your center, and grow stronger in both body and
            mind? Let’s move, breathe, and transform together with every practice!
          </div>

          <div className="ai-btn" onClick={handlePurchaseClick}>
            <div className="ai-btn-left">
              <div className="ai-coin" style={{ backgroundImage: `url(${coinIcon})` }} />
              <span>X {needCoinCount}</span>
            </div>

            <div className="ai-btn-right">Chat</div>
          </div>
        </div>
      </div>

      {showCoinNot && (
        <div
          className="ai-dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCoinNot(false)
          }}
        >
          <CoinNotDialog
            onRecharge={() => {
              setShowCoinNot(false)
              nav('/coins')
            }}
          />
        </div>
      )}
    </div>
  )
}
