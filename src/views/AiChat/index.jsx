import React, { useEffect, useRef, useState } from 'react'
import BackButton from '@/components/BackButton.jsx'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUIStore } from '@/stores/ui'
import { aiChat } from '@/utils/ai'
import { decryptAES } from '@/utils/aes'

import aibgc from '@/assets/aibgc.png'
import aiusermodel from '@/assets/aiusermodel.png'
import aichatmodel from '@/assets/aichatmodel.png'
import aiAvatar from '@/assets/aiavator.png'
import sendIcon from '@/assets/commentsend.png'

export default function AiChat() {
  const currentUser = useCurrentUserStore((s) => s.currentUser)
  const ui = useUIStore()

  const [messages] = useState(["I'm feeling great today.", 'Do you like reading?', 'Can you comfort me?'])
  const [chatInput, setChatInput] = useState('')

  const listRef = useRef(null)

  const getFirstTime = () => {
    const key = 'chat_first_time'
    const saved = localStorage.getItem(key)
    if (saved) return saved
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    localStorage.setItem(key, time)
    return time
  }

  const [bottomItems, setBottomItems] = useState(() => [
    {
      sendId: '0',
      time: getFirstTime(),
      message: 'Hi there! I’m Kico, your AI buddy for all things fun and creative.',
    },
  ])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [bottomItems.length])

  async function requestAI(text) {
    if (ui.loading) return
    ui.showLoading()
    try {
      const res = await aiChat(text)
      ui.hideLoading()

      if (res.data.code === '0000') {
        const decryptText = decryptAES(res.data.result)
        const data = JSON.parse(decryptText)
        const aiMessage = data?.output?.choices?.[0]?.message?.content || ''

        setBottomItems((prev) => [
          ...prev,
          {
            sendId: '0',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message: aiMessage,
          },
        ])
      } else {
        ui.showToast(res.data.message)
      }
    } catch {
      ui.hideLoading()
      ui.showToast('Network error')
    }
  }

  function pushUserMessage(text) {
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setBottomItems((prev) => [
      ...prev,
      {
        sendId: currentUser.userId,
        time,
        message: text,
      },
    ])
  }

  async function handleMessageClick(message) {
    pushUserMessage(message)
    await requestAI(message)
  }

  async function sendMessage() {
    const text = chatInput.trim()
    if (!text) return
    pushUserMessage(text)
    setChatInput('')
    await requestAI(text)
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
          left: 'calc(100vw * 20 / 375)',
          top: 'calc(100vh * 40 / 812)',
          width: 'calc(100vw * 179 / 375)',
          height: 'calc(100vh * 314 / 812)',
          backgroundImage: `url(${aiusermodel})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 'calc(100vw * 181 / 375)',
          top: 'calc(100vh * 62 / 812)',
          width: 'calc(100vw * 104 / 375)',
          height: 'calc(100vh * 38 / 812)',
          backgroundImage: `url(${aichatmodel})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
        }}
      />

      <div style={{ position: 'relative', zIndex: 100, marginTop: 'calc(100vh * 56 / 812)', marginLeft: 'calc(100vw * 20 / 375)' }}>
        <BackButton />
      </div>

      <div
        style={{
          marginTop: 'calc(100vh * 41 / 812)',
          marginLeft: 'calc(100vw * 187 / 375)',
          marginRight: 'calc(100vw * 28 / 375)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'calc(100vh * 12 / 812)',
          position: 'relative',
          zIndex: 100,
        }}
      >
        {messages.map((item, index) => (
          <div
            key={index}
            onClick={() => handleMessageClick(item)}
            role="button"
            tabIndex={0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 'calc(100vh * 36 / 812)',
              padding: '0 calc(100vw * 10 / 375)',
              borderRadius: 'calc(100vw * 40 / 375)',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(calc(100vw * 4 / 375))',
              fontFamily: 'Archivo, sans-serif',
              fontSize: 'calc(100vw * 14 / 375)',
              fontWeight: 400,
              lineHeight: 'calc(100vw * 15.23 / 375)',
              color: '#fff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: 'fit-content',
              cursor: 'pointer',
            }}
          >
            {item}
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 'calc(100vh * 325 / 812)',
          background: '#fff',
          borderRadius: 'calc(100vw * 40 / 375) calc(100vw * 40 / 375) 0 0',
          zIndex: 2,
        }}
      >
        <div
          ref={listRef}
          style={{
            height: 'calc(100% - calc(100vh * 20 / 812))',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            marginTop: 'calc(100vh * 20 / 812)',
            paddingBottom: 'calc(100vh * 90 / 812)',
            boxSizing: 'border-box',
            gap: 'calc(100vh * 24 / 812)',
          }}
        >
          {bottomItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(100vh * 16 / 812)' }}>
                <div
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Archivo, sans-serif',
                    fontSize: 'calc(100vw * 16 / 375)',
                    fontWeight: 400,
                    lineHeight: 'calc(100vw * 17.41 / 375)',
                    color: 'rgba(105, 71, 65, 1)',
                  }}
                >
                  {item.time}
                </div>

                {item.sendId === '0' ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'calc(100vw * 12 / 375)',
                      marginLeft: 'calc(100vw * 20 / 375)',
                      marginRight: 'calc(100vw * 34 / 375)',
                    }}
                  >
                    <img src={aiAvatar} alt="AI Avatar" style={{ width: 'calc(100vw * 44 / 375)', height: 'calc(100vw * 44 / 375)', borderRadius: '50%' }} />
                    <div
                      style={{
                        borderRadius:
                          '0 calc(100vw * 10 / 375) calc(100vw * 10 / 375) calc(100vw * 10 / 375)',
                        background: 'rgba(255, 159, 142, 1)',
                        padding: 'calc(100vh * 10 / 812) calc(100vw * 10 / 375)',
                        fontFamily: 'Archivo, sans-serif',
                        fontSize: 'calc(100vw * 14 / 375)',
                        fontWeight: 400,
                        lineHeight: 'calc(100vw * 15.23 / 375)',
                        color: '#fff',
                      }}
                    >
                      {item.message}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-end',
                      gap: 'calc(100vw * 12 / 375)',
                      marginLeft: 'calc(100vw * 34 / 375)',
                      marginRight: 'calc(100vw * 20 / 375)',
                    }}
                  >
                    <div
                      style={{
                        borderRadius:
                          'calc(100vw * 10 / 375) 0 calc(100vw * 10 / 375) calc(100vw * 10 / 375)',
                        background: 'rgba(201, 255, 221, 1)',
                        padding: 'calc(100vh * 10 / 812) calc(100vw * 10 / 375)',
                        fontFamily: 'Archivo, sans-serif',
                        fontSize: 'calc(100vw * 14 / 375)',
                        fontWeight: 400,
                        lineHeight: 'calc(100vw * 15.23 / 375)',
                        color: 'rgba(105, 71, 65, 1)',
                      }}
                    >
                      {item.message}
                    </div>
                    <div
                      style={{
                        width: 'calc(100vw * 44 / 375)',
                        height: 'calc(100vw * 44 / 375)',
                        flexShrink: 0,
                        borderRadius: '50%',
                        padding: 'calc(100vw * 1 / 375)',
                        background:
                          'linear-gradient(135deg, rgba(255, 159, 142, 1) 0%, rgba(241, 213, 160, 1) 32.13%, rgba(201, 255, 221, 1) 67.84%, rgba(157, 255, 255, 1) 100%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={currentUser.avator}
                        alt="me"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 'calc(100vw * 20 / 375)',
          right: 'calc(100vw * 20 / 375)',
          bottom: 'calc(100vh * 29 / 812)',
          height: 'calc(100vh * 54 / 812)',
          display: 'flex',
          alignItems: 'center',
          gap: 'calc(100vw * 10 / 375)',
          background: 'rgba(201, 255, 221, 1)',
          borderRadius: 'calc(100vw * 40 / 375)',
          backdropFilter: 'blur(calc(100vw * 32 / 375))',
          boxSizing: 'border-box',
          padding: '0 calc(100vw * 16 / 375)',
          zIndex: 200,
        }}
      >
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Say something"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 'calc(100vw * 14 / 375)',
            fontWeight: 400,
            lineHeight: 'calc(100vw * 15.23 / 375)',
            fontFamily: 'Archivo, sans-serif',
            color: '#000',
          }}
        />
        <img
          className="send-icon"
          src={sendIcon}
          alt="Send"
          style={{
            width: 'calc(100vw * 30 / 375)',
            height: 'calc(100vw * 30 / 375)',
            cursor: 'pointer',
          }}
          onClick={sendMessage}
        />
      </div>
    </div>
  )
}

