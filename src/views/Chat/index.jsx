import React, { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import BackButton from '@/components/BackButton/index.jsx'
import ReportDialog from '@/components/ReportDialog/index.jsx'
import NavBar from '@/components/NavBar'
import CallVideo from '@/views/CallVideo'
import { useChatsStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useMessagesStore } from '@/stores/message'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUIStore } from '@/stores/ui'
import { uploadSingleImage } from '@/utils/ossUpload'
import { goBackOrClose } from '@/utils/iosBridge'
import pageBg from '@/assets/pagebgc.png'
import './index.css'
import picIcon from '@/assets/chatpicicon.png'
import videoIcon from '@/assets/chatvideoicon.png'
import sendIcon from '@/assets/commentsend.png'

export default function Chat() {
  const { chatId: rawChatId } = useParams()
  const chatId = String(rawChatId || '')
  const nav = useNavigate()

  const chatsStore = useChatsStore()
  const getUserById = useUserStore((s) => s.getUserById)
  const getOtherUserInChat = useUserStore((s) => s.getOtherUserInChat)
  const getMessagesByChatId = useMessagesStore((s) => s.getMessagesByChatId)
  const addMessage = useMessagesStore((s) => s.addMessage)
  const message = useMessagesStore((s) => s.message)
  const currentUser = useCurrentUserStore((s) => s.currentUser)
  const ui = useUIStore()

  const currentChat = useMemo(() => chatsStore.getChatById(chatId), [chatsStore, chatId])
  const otherUser = useMemo(
    () => (currentChat ? getOtherUserInChat(currentChat.chatUserIds) : null),
    [currentChat, getOtherUserInChat],
  )

  const currentUserId = currentUser?.userId
  const [showCall, setShowCall] = useState(false)
  const [inputText, setInputText] = useState('')
  const [showReport, setShowReport] = useState(false)
  const fileInputRef = useRef(null)

  const messages = useMemo(
    () => getMessagesByChatId(chatId) || [],
    [getMessagesByChatId, chatId, message],
  )

  function getUserAvatar(userId) {
    return getUserById(userId)?.avatar || ''
  }

  function formatTime(timeStr) {
    const date = new Date(timeStr)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  function goOtherHome(userId) {
    if (!userId) return
    nav(`/otherHome/${userId}`)
  }

  function selectImage() {
    fileInputRef.current?.click()
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (ui.loading) return
    ui.showLoading()

    try {
      const url = await uploadSingleImage(file, 'template_development')

      addMessage?.({
        msgId: String((message || []).length + 1),
        chatId,
        userId: currentUserId,
        sendContent: '',
        sendPicUrl: url,
        sendTime: new Date().toISOString(),
      })

      chatsStore.updateChat?.(chatId, {
        lastSendContent: '[image message]',
        lastSendTime: new Date().toISOString(),
        unreadMsgCount: (currentChat?.unreadMsgCount || 0) + 1,
        lastSendUserId: currentUserId,
      })
    } catch (err) {
      console.error('upload image failed', err)
      ui.showToast('Upload failed, please check your network.')
    } finally {
      ui.hideLoading()
      e.target.value = ''
    }
  }

  function sendMessage() {
    if (!inputText.trim()) return

    addMessage?.({
      msgId: String((message || []).length + 1),
      chatId,
      userId: currentUserId,
      sendContent: inputText,
      sendPicUrl: '',
      sendTime: new Date().toISOString(),
    })

    chatsStore.updateChat?.(chatId, {
      lastSendContent: inputText,
      lastSendTime: new Date().toISOString(),
      unreadMsgCount: (currentChat?.unreadMsgCount || 0) + 1,
      lastSendUserId: currentUserId,
    })

    setInputText('')
  }

  function reportSelect(value) {
    setShowReport(false)
    if (value === 0) {
      nav('/report')
      return
    }
    if (value === 1) {
      if (ui.loading) return
      ui.showLoading()

      const blockList = currentUser.blockList ? [...currentUser.blockList] : []
      if (otherUser?.userId && !blockList.includes(otherUser.userId)) {
        blockList.unshift(otherUser.userId)
        useUserStore.getState().updateUser(currentUser.userId, { blockList })
      }

      const delay = Math.floor(Math.random() * 1500) + 500
      setTimeout(() => {
        ui.hideLoading()
        ui.showToast('Blocking successful')
        goBackOrClose()
      }, delay)
    }
  }

  if (!currentChat) {
    return (
      <div
        className="chat-page"
        style={{ backgroundImage: `url(${pageBg}) no-repeat top center / cover` }}
      >
        <div className="chat-top-content">
          <BackButton />
          <div className="chat-username">Chat not found</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="chat-page"
      style={{ backgroundImage: `url(${pageBg}) no-repeat top center / cover` }}
    >
      <NavBar
        showMore={otherUser.userId !== currentUser.userId}
        onMoreClick={() => setShowReport(true)}
      >
        <div className="chat-top-content">
          <div className="chat-left-part">
            <div
              className="chat-user-info"
              onClick={() => goOtherHome(otherUser?.userId)}
              role="button"
              tabIndex={0}
            >
              <div
                className="chat-avatar"
                style={{
                  backgroundImage: otherUser?.avatar ? `url(${otherUser.avatar})` : undefined,
                }}
                aria-hidden="true"
              />
              <span className="chat-username">{otherUser?.name}</span>
            </div>
          </div>

          <div className="chat-right-part">
            <div className="chat-icon-group">
              <button type="button" className="chat-icon-btn" onClick={selectImage}>
                <img src={picIcon} alt="image" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <button type="button" className="chat-icon-btn" onClick={() => setShowCall(true)}>
                <img src={videoIcon} alt="video" />
              </button>
            </div>
          </div>
        </div>
      </NavBar>
      <div className="chat-messages">
        {messages.map((msg) => {
          const own = msg.userId === currentUserId
          return (
            <div key={msg.msgId} className={`chat-item ${own ? 'own-message' : ''}`}>
              <div
                className="chat-msg-avatar"
                onClick={() => goOtherHome(msg.userId)}
                role="button"
                tabIndex={0}
                style={{
                  backgroundImage: getUserAvatar(msg.userId)
                    ? `url(${getUserAvatar(msg.userId)})`
                    : undefined,
                }}
              />

              <div className="chat-right">
                {own && msg.sendPicUrl ? (
                  <div className="chat-message-image">
                    <div className="image-container">
                      <img src={msg.sendPicUrl} alt="send" />
                    </div>
                  </div>
                ) : (
                  <div className="chat-message">{msg.sendContent}</div>
                )}
                <div className="chat-time">{formatTime(msg.sendTime)}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="chat-bottom-input">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Say something"
        />
        <button type="button" className="chat-send-btn" onClick={sendMessage}>
          <img src={sendIcon} alt="send" />
        </button>
      </div>

      <ReportDialog
        open={showReport}
        onClose={() => setShowReport(false)}
        onSelect={reportSelect}
      />
      {showCall && (
        <div className={`call-wrapper ${showCall ? 'show' : ''}`}>
          <CallVideo userId={otherUser?.userId} onHangup={() => setShowCall(false)} />
        </div>
      )}
    </div>
  )
}
