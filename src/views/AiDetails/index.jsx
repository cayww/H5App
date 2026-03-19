import React, { useState } from 'react'
import BackButton from '@/components/BackButton.jsx'
import CoinNotDialog from '@/components/CoinNotDialog.jsx'
import { useNavigate } from 'react-router-dom'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'

import aibgc from '@/assets/aibgc.png'
import aiusermodel from '@/assets/aiusermodel.png'
import aichatmodel from '@/assets/aichatmodel.png'
import coinIcon from '@/assets/coin.png'

export default function AiDetails() {
  const nav = useNavigate()
  const ui = useUIStore()
  const currentUser = useCurrentUserStore((s) => s.currentUser)
  const updateUser = useUserStore((s) => s.updateUser)

  const [showCoinNot, setShowCoinNot] = useState(false)

  function handlePurchaseClick() {
    if ((currentUser.coins || 0) >= 100) {
      if (ui.loading) return
      ui.showLoading()

      const currentCoins = (currentUser.coins || 0) - 100
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
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000',
        backgroundImage: `url(${aibgc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 'calc(100vh * 68 / 812)',
          width: 'calc(100vw * 229 / 375)',
          height: 'calc(100vh * 402 / 812)',
          opacity: 1,
          backgroundImage: `url(${aiusermodel})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 'calc(100vw * 197 / 375)',
          top: 'calc(100vh * 134 / 812)',
          width: 'calc(100vw * 104 / 375)',
          height: 'calc(100vh * 38 / 812)',
          opacity: 1,
          backgroundImage: `url(${aichatmodel})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div
        style={{
          width: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            marginTop: 'calc(100vh * 56 / 812)',
            marginLeft: 'calc(100vw * 20 / 375)',
            zIndex: 100,
          }}
        >
          <BackButton />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', zIndex: 99 }}>
          <div
            style={{
              width: '100%',
              background: '#fff',
              borderRadius: 'calc(100vw * 40 / 375) calc(100vw * 40 / 375) 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 'calc(100vh * 24 / 812)',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                fontFamily: 'YesevaOne, sans-serif',
                fontSize: 'calc(100vw * 24 / 375)',
                fontWeight: 400,
                lineHeight: 'calc(100vw * 27.72 / 375)',
                letterSpacing: 0,
                color: 'rgba(74, 32, 25, 1)',
                textAlign: 'center',
                marginBottom: 'calc(100vh * 20 / 812)',
              }}
            >
              Tenao AI
            </div>
            <div
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontSize: 'calc(100vw * 16 / 375)',
                fontWeight: 400,
                lineHeight: 'calc(100vw * 24 / 375)',
                letterSpacing: 0,
                color: 'rgba(74, 32, 25, 1)',
                textAlign: 'center',
                margin: '0 calc(100vw * 28 / 375)',
              }}
            >
              Hi! I’m Kico, your friendly AI companion here to chat about all your passions and interests. Whether you love fashion, art, music, or anything in between, I’m here to explore ideas, share tips, and keep the conversation fun and inspiring. Ready to dive into your favorite hobbies together? Let’s talk and discover something new every day!
            </div>

            <div
              className="ai-purchase-container"
              onClick={handlePurchaseClick}
              role="button"
              tabIndex={0}
              style={{
                marginTop: 'calc(100vh * 15 / 812)',
                marginBottom: 'calc(100vh * 25 / 812)',
                width: 'calc(100vw * 281 / 375)',
                height: 'calc(100vh * 62 / 812)',
                borderRadius: 'calc(100vw * 40 / 375)',
                background:
                  'linear-gradient(135deg, rgba(255, 159, 142, 1) 0%, rgba(241, 213, 160, 1) 32.13%, rgba(201, 255, 221, 1) 67.84%, rgba(157, 255, 255, 1) 100%)',
                boxShadow:
                  'inset calc(100vw * -2 / 375) calc(100vw * -2 / 375) calc(100vw * 2 / 375) rgba(255, 255, 255, 0.6), inset calc(100vw * 2 / 375) calc(100vw * 2 / 375) calc(100vw * 2 / 375) rgba(255, 255, 255, 0.5)',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 'calc(100vw * 46 / 375)',
                paddingRight: 'calc(100vw * 11 / 375)',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(100vw * 13 / 375)' }}>
                <div
                  style={{
                    width: 'calc(100vw * 33 / 375)',
                    height: 'calc(100vh * 39 / 812)',
                    backgroundImage: `url(${coinIcon})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'YesevaOne, sans-serif',
                    fontSize: 'calc(100vw * 20 / 375)',
                    fontWeight: 400,
                    lineHeight: 'calc(100vw * 23.1 / 375)',
                    letterSpacing: 0,
                    color: 'rgba(74, 32, 25, 1)',
                  }}
                >
                  100
                </div>
              </div>

              <div
                style={{
                  width: 'calc(100vw * 73 / 375)',
                  height: 'calc(100vh * 38 / 812)',
                  borderRadius: 'calc(100vw * 40 / 375)',
                  background: 'rgba(74, 32, 25, 1)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'Archivo, sans-serif',
                  fontSize: 'calc(100vw * 16 / 375)',
                  fontWeight: 400,
                  lineHeight: 'calc(100vw * 17.41 / 375)',
                  letterSpacing: 0,
                  color: '#fff',
                  boxSizing: 'border-box',
                }}
              >
                Chat
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCoinNot ? (
        <div
          className="ai-dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCoinNot(false)
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <CoinNotDialog
            onRecharge={() => {
              setShowCoinNot(false)
              nav('/coins')
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

