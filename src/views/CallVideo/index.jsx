import React, { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/user'
import hangupIcon from '@/assets/hangupicon.png'
import './index.css'

export default function VideoCall({ userId, onHangup }) {
  const getUserById = useUserStore((s) => s.getUserById)
  const userInfo = getUserById(userId)

  const [callingText, setCallingText] = useState('Calling')

  useEffect(() => {
    let dotCount = 0

    const timer = setInterval(() => {
      dotCount = (dotCount + 1) % 4
      setCallingText('Calling' + '.'.repeat(dotCount))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  function handleHangup() {
    onHangup?.()
  }

  return (
    <div
      className="video-call"
      style={{
        backgroundImage: userInfo?.avatar ? `url(${userInfo.avatar})` : undefined,
      }}
    >
      <div className="bg-gradient" />
      {/* Avatar */}
      <div className="avatar-outer">
        <div className="avatar-inner">
          <img src={userInfo?.avatar} alt="avatar" />
        </div>
      </div>
      <div className="call-panel">
        <div className="user-name">{userInfo?.name}</div>
        <div className="calling-text">{callingText}</div>
      </div>
      <div className="hangup-btn" onClick={handleHangup}>
        <img src={hangupIcon} alt="hangup" />
      </div>
    </div>
  )
}
