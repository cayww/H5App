import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavBar from '@/components/NavBar'
import ReportDialog from '@/components/ReportDialog/index.jsx'
import Empty from '@/components/Empty.jsx'

import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { useOtherStore } from '@/stores/other'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUIStore } from '@/stores/ui'
import { useChatsStore } from '@/stores/chat'
import { useBack } from '@/utils/iosBridge'

import './index.css'
import followIcon from '@/assets/follow.png'
import chatIcon from '@/assets/chaticon.png'
import likeIcon from '@/assets/likepic.png'
import unLikeIcon from '@/assets/dislikepic.png'
import picIcon from '@/assets/picIcon.png'
// import commentIcon from '@/assets/chaticon.png'
// import reportIcon from '@/assets/postpiccommentreport.png'

export default function OtherHome() {
  const { userId: rawUserId } = useParams()
  const userId = String(rawUserId || '')
  const nav = useNavigate()
  const goBack = useBack()
  const getUserById = useUserStore((s) => s.getUserById)
  const updateUser = useUserStore((s) => s.updateUser)
  const getPostsByUserId = usePostStore((s) => s.getPostsByUserId)
  const getTagByIndex = useOtherStore((s) => s.getTagByIndex)
  const currentUser = useCurrentUserStore((s) => s.currentUser)
  const ui = useUIStore()
  const chatStore = useChatsStore()

  const profile = useMemo(() => getUserById(userId) || {}, [getUserById, userId])
  const userPosts = useMemo(() => getPostsByUserId(userId) || [], [getPostsByUserId, userId])

  const [showReport, setShowReport] = useState(false)

  function reportSelect(value) {
    setShowReport(false)
    if (value === 0) {
      nav('/report')
      return
    }
    if (value === 1) {
      if (ui.loading) return
      ui.showLoading()

      const blockList = currentUser.blockList || []
      if (!blockList.includes(userId)) {
        blockList.unshift(userId)
        updateUser(currentUser.userId, { blockList })
      }

      const delay = Math.floor(Math.random() * 1500) + 500
      setTimeout(() => {
        ui.hideLoading()
        ui.showToast('Blocking successful')
        goBack()
      }, delay)
    }
  }

  function handleFollow() {
    const currentUserId = currentUser.userId
    const targetUserId = userId

    const currentUserFollow = currentUser.follow ? [...currentUser.follow] : []
    const postUserFans = profile.fans ? [...profile.fans] : []

    const isFollowed = currentUserFollow.includes(targetUserId)

    if (isFollowed) {
      const newFollow = currentUserFollow.filter((id) => id !== targetUserId)
      const newFans = postUserFans.filter((id) => id !== currentUserId)

      updateUser(currentUserId, { follow: newFollow })
      updateUser(targetUserId, { fans: newFans })

      ui.showToast('Unfollowed')
    } else {
      currentUserFollow.unshift(targetUserId)
      postUserFans.unshift(currentUserId)

      updateUser(currentUserId, { follow: currentUserFollow })
      updateUser(targetUserId, { fans: postUserFans })

      ui.showToast('Followed successfully')
    }
  }

  function handleChat() {
    if (ui.loading) return
    ui.showLoading()
    const currentUserId = currentUser.userId

    const existChat = (chatStore.chat || []).find((chat) => {
      const ids = chat.chatUserIds || []
      return ids.includes(currentUserId) && ids.includes(userId)
    })

    let chatId
    if (existChat) {
      chatId = existChat.chatId
    } else {
      const newChat = {
        chatId: String((chatStore.chat || []).length + 1),
        chatUserIds: [currentUserId, userId],
        lastSendContent: '',
        lastSendTime: new Date().toISOString(),
        unreadMsgCount: 0,
        lastSendUserId: currentUserId,
      }
      chatStore.addChat?.(newChat)
      chatId = newChat.chatId
    }

    const delay = Math.floor(Math.random() * 1500) + 500
    setTimeout(() => {
      ui.hideLoading()
      nav(`/chat/${chatId}`)
    }, delay)
  }

  function toPostDetail(dynamicId, dynamicType) {
    if (dynamicType == 0) nav(`/picPostDetails/${dynamicId}`)
    if (dynamicType == 1) nav(`/videoPostDetails/${dynamicId}`)
  }

  const canFollow =
    userId && userId !== currentUser.userId && !(currentUser.follow || []).includes(userId)

  return (
    <div className="other-home-page">
      <NavBar showMore={userId !== currentUser.userId} onMoreClick={() => setShowReport(true)} />
      {/* 
      <div
        className="other-home-avatar-bg"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.14)), url(${profile.avatar || ''})`,
        }}
      /> 
      */}
      <div className="other-home-scroll">
        <div className="other-home-top">
          <div
            className="other-home-avatar"
            style={{
              ['--avatar-url']: profile.avatar ? `url(${profile.avatar})` : 'none',
            }}
          >
            {/* {canFollow ? (
              <div
                className="other-home-follow-btn"
                onClick={handleFollow}
                role="button"
                tabIndex={0}
              >
                <img src={followIcon} alt="follow" />
              </div>
            ) : null} */}
          </div>
          <div className="other-home-nd">
            <div className="other-home-name">{profile.name}</div>
            <div className="other-home-about">{profile.about}</div>
          </div>
        </div>
        <div className="other-home-stats">
          <div className="other-home-stat">
            <div className="n">{userPosts.length || 0}</div>
            <div className="l">Posts</div>
          </div>
          <div className="other-home-stat">
            <div className="n">{(profile.fans || []).length || 0}</div>
            <div className="l">Fans</div>
          </div>
          <div className="other-home-stat">
            <div className="n">{(profile.follow || []).length || 0}</div>
            <div className="l">Follow</div>
          </div>
        </div>
        <div className="other-home-intro-chat">
          {/* <div className="other-home-intro">{profile.about}</div> */}
          <div className="other-home-follow-btn" onClick={handleFollow} role="button" tabIndex={0}>
            {!canFollow ? null : <img src={followIcon} alt="follow" />}
            <div className="other-follow-btn-text">{!canFollow ? 'Unfollow' : 'follow'}</div>
          </div>
          {userId !== currentUser.userId ? (
            <div className="other-home-chat-btn" onClick={handleChat} role="button" tabIndex={0}>
              <img src={chatIcon} alt="chat" />
              <span className="other-home-chat-text">Chat</span>
            </div>
          ) : (
            <div className="other-home-chat-btn-hidden" />
          )}
        </div>
        <div className="other-home-post-title">Post</div>
        <div className="other-home-post-list">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              // <div
              //   key={post.dynamicId}
              //   className="other-home-post-item"
              //   onClick={() => toPostDetail(post.dynamicId, post.dynamicType)}
              //   role="button"
              //   tabIndex={0}
              // >
              //   <div className="other-home-post-top">
              //     <div className="other-home-post-username">{profile.name}</div>
              //   </div>

              //   <div
              //     className="other-home-post-image"
              //     style={{
              //       backgroundImage: post.dynamicPic?.[0]
              //         ? `url(${post.dynamicPic[0]})`
              //         : undefined,
              //     }}
              //   >
              //     <div className="other-home-post-overlay">
              //       <div className="other-home-overlay-pill">
              //         <img src={likeIcon} alt="like" className="other-home-overlay-icon" />
              //         <span>{post.dynamicLikeCount || 0}</span>
              //       </div>
              //       <div className="other-home-overlay-pill">
              //         {/* <img src={commentIcon} alt="comment" className="other-home-overlay-icon" /> */}
              //         <span>{post.dynamicCommentCount || 0}</span>
              //       </div>
              //     </div>
              //   </div>

              //   <div className="other-home-post-type">{post.dynamicDesc}</div>
              // </div>
              <div
                key={post.dynamicId}
                className="other-home-post-item"
                onClick={() => toPostDetail(post.dynamicId, post.dynamicType)}
                role="button"
                tabIndex={0}
              >
                <div className="other-home-post-top">
                  <div
                    className="other-home-post-top-avatar"
                    style={{
                      ['--avatar-url']: profile.avatar ? `url(${profile.avatar})` : 'none',
                    }}
                  ></div>
                  <div className="other-home-post-username">{profile.name}</div>
                </div>
                <div
                  className="other-home-post-image"
                  style={{
                    backgroundImage: post.dynamicPic?.[0]
                      ? `url(${post.dynamicPic[0]})`
                      : undefined,
                  }}
                >
                  <div className="other-home-post-item-top">
                    <img src={picIcon} alt="picicon" className="other-home-post-item-pic-icon" />
                    <div className="other-home-post-item-pic-text">
                      # {getTagByIndex(post.dynamicTitleType)}
                    </div>
                  </div>
                  <div className="other-home-post-type">{post.dynamicDesc}</div>
                  <div className="other-home-post-overlay">
                    <div className="other-home-overlay-pill">
                      <img
                        src={
                          !currentUser.picPostLikeIds.includes(post.dynamicId)
                            ? unLikeIcon
                            : likeIcon
                        }
                        alt="like"
                        className="other-home-overlay-icon"
                      />
                      <span>{post.dynamicLikeCount || 0}</span>
                    </div>
                    {/* <div className="other-home-overlay-pill">
                      <img src={commentIcon} alt="comment" className="other-home-overlay-icon" />
                      <span>{post.dynamicCommentCount || 0}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </div>
      </div>

      <ReportDialog
        open={showReport}
        onClose={() => setShowReport(false)}
        onSelect={reportSelect}
      />
    </div>
  )
}
