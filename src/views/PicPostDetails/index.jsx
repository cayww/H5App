import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Swiper } from 'antd-mobile'

import BackButton from '@/components/BackButton.jsx'
import MoreButton from '@/components/MoreButton.jsx'
import ReportDialog from '@/components/ReportDialog.jsx'
import Empty from '@/components/Empty.jsx'

import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'
import { useOtherStore } from '@/stores/other'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUIStore } from '@/stores/ui'
import { useCommentsStore } from '@/stores/comment'
import { goBackOrClose } from '@/utils/iosBridge'

import './picPostDetails.css'
import likeImage from '@/assets/likepic.png'
import disLikeImage from '@/assets/dislikepic.png'
import commentMoreImage from '@/assets/postpiccommentreport.png'
import commentSendImage from '@/assets/commentsend.png'

export default function PicPostDetails() {
  const { postId: rawPostId } = useParams()
  const postId = String(rawPostId || '')
  const nav = useNavigate()

  const ui = useUIStore()
  const post = usePostStore((s) => s.getPostById(postId))
  const updatePostById = usePostStore((s) => s.updatePostById)
  const getUserById = useUserStore((s) => s.getUserById)
  const updateUser = useUserStore((s) => s.updateUser)
  const getTagByIndex = useOtherStore((s) => s.getTagByIndex)
  const currentUser = useCurrentUserStore((s) => s.currentUser)
  const getCommentsById = useCommentsStore((s) => s.getCommentsById)
  const addComment = useCommentsStore((s) => s.addComment)

  const postUser = useMemo(() => (post ? getUserById(post.userId) : null), [getUserById, post])
  const images = useMemo(() => (post?.dynamicPic || []).filter(Boolean), [post])
  const postTag = useMemo(() => (post ? getTagByIndex(post.dynamicTitleType) : ''), [getTagByIndex, post])

  const [commentInput, setCommentInput] = useState('')
  const [showPostReport, setShowPostReport] = useState(false)
  const [showCommentReport, setShowCommentReport] = useState(false)
  const [reportCommentUserId, setReportCommentUserId] = useState(null)

  const blockListKey = (currentUser?.blockList || []).join('|')
  const comments = useMemo(() => getCommentsById(postId) || [], [getCommentsById, postId])

  if (!post) {
    return (
      <div className="ppd-page">
        <div className="ppd-not-found">The post was not found.</div>
      </div>
    )
  }

  function goOtherHome(userId) {
    if (!userId) return
    nav(`/otherHome/${userId}`)
  }

  function toggleLike() {
    const postLikeIds = currentUser.postLikeIds ? [...currentUser.postLikeIds] : []
    const idx = postLikeIds.indexOf(postId)
    if (idx === -1) postLikeIds.push(postId)
    else postLikeIds.splice(idx, 1)

    updateUser(currentUser.userId, { postLikeIds })
  }

  function postReportSelect(value) {
    setShowPostReport(false)
    if (value === 0) {
      nav('/report')
      return
    }
    if (value === 1) {
      if (ui.loading) return
      ui.showLoading()

      const postUserId = post.userId
      const blockList = currentUser.blockList ? [...currentUser.blockList] : []
      if (postUserId && !blockList.includes(postUserId)) {
        blockList.unshift(postUserId)
        updateUser(currentUser.userId, { blockList })
      }

      const delay = Math.floor(Math.random() * 1500) + 500
      setTimeout(() => {
        ui.hideLoading()
        ui.showToast('Blocking successful')
        goBackOrClose()
      }, delay)
    }
  }

  function handleCommentReport(userId) {
    setReportCommentUserId(userId)
    setShowCommentReport(true)
  }

  function commentReportSelect(value) {
    setShowCommentReport(false)
    const userIdToBlock = reportCommentUserId
    if (!userIdToBlock) return

    if (value === 0) {
      nav('/report')
      return
    }
    if (value === 1) {
      if (ui.loading) return
      ui.showLoading()

      const blockList = currentUser.blockList ? [...currentUser.blockList] : []
      if (!blockList.includes(userIdToBlock)) {
        blockList.unshift(userIdToBlock)
        updateUser(currentUser.userId, { blockList })
      }

      const delay = Math.floor(Math.random() * 1500) + 500
      setTimeout(() => {
        ui.hideLoading()
        ui.showToast('Blocking successful')
      }, delay)
    }
  }

  function sendComment() {
    const content = commentInput.trim()
    if (!content) return

    const newComment = {
      commentId: String((useCommentsStore.getState().comment || []).length + 1),
      dynamicId: String(postId),
      userId: currentUser.userId,
      content,
    }

    addComment(newComment)
    updatePostById(postId, { dynamicCommentCount: (post.dynamicCommentCount || 0) + 1 })
    setCommentInput('')
  }

  const liked = (currentUser.postLikeIds || []).includes(postId)
  const likeCount = (post.dynamicLikeCount || 0) + (liked ? 1 : 0)

  return (
    <div className="ppd-page">
      <div className="ppd-page-content">
        <div className="ppd-swipe-wrapper">
          {images.length ? (
            <Swiper loop={false} indicator={(total, current) => (
              <div className="ppd-indicator-wrapper">
                {Array.from({ length: total }).map((_, i) => (
                  <span key={i} className={`ppd-indicator ${i === current ? 'active' : ''}`} />
                ))}
              </div>
            )}>
              {images.map((src, idx) => (
                <Swiper.Item key={idx}>
                  <div className="ppd-swipe-item">
                    <img src={src} className="ppd-swipe-img" alt="" />
                  </div>
                </Swiper.Item>
              ))}
            </Swiper>
          ) : (
            <div className="ppd-swipe-empty" />
          )}

          <div className="ppd-top-btn">
            <BackButton />
            {post.userId !== currentUser.userId ? <MoreButton onClick={() => setShowPostReport(true)} /> : <div />}
          </div>
        </div>

        <div className="ppd-post-content">
          <div className="ppd-post-row">
            <div className="ppd-post-content-row">
              <div className="ppd-user-box">
                <div className="ppd-avatar" onClick={() => goOtherHome(postUser?.userId)} role="button" tabIndex={0}>
                  <div
                    className="ppd-avatar-img"
                    style={{
                      backgroundImage: postUser?.avator ? `url(${postUser.avator})` : undefined,
                    }}
                  />
                </div>
                <div className="ppd-user-name" onClick={() => goOtherHome(postUser?.userId)} role="button" tabIndex={0}>
                  {postUser?.name}
                </div>
              </div>

              <div className="ppd-second-box">
                <div className="ppd-post-desc">{post.dynamicDesc}</div>
                <div className="ppd-tag-box">
                  <div className="ppd-tag-text"># {postTag}</div>
                </div>
              </div>
            </div>

            <div className="ppd-like-box" onClick={toggleLike} role="button" tabIndex={0}>
              <img
                src={liked ? likeImage : disLikeImage}
                alt="like"
                className="ppd-like-icon-img"
              />
              <div className="ppd-like-count">{likeCount}</div>
            </div>
          </div>
        </div>

        <div className="ppd-comments-title">
          <div className="ppd-comments-box1" />
          <div className="ppd-comments-title-text">Comments</div>
          <div className="ppd-comments-box2" />
        </div>

        <div className="ppd-comments-list">
          {comments.length ? (
            comments.map((comment) => (
              <div key={comment.commentId} className="ppd-comment-item">
                <div className="ppd-comment-list-top">
                  <div className="ppd-comment-list-user" onClick={() => goOtherHome(comment.userId)} role="button" tabIndex={0}>
                    <div className="ppd-comment-avatar">
                      <div
                        className="ppd-comment-avatar-img"
                        style={{
                          backgroundImage: (() => {
                            const u = getUserById(comment.userId)
                            return u?.avator ? `url(${u.avator})` : undefined
                          })(),
                        }}
                      />
                    </div>
                    <div className="ppd-comment-user-name">{getUserById(comment.userId)?.name}</div>
                  </div>

                  {comment.userId !== currentUser.userId ? (
                    <button
                      type="button"
                      className="ppd-comments-more"
                      onClick={() => handleCommentReport(comment.userId)}
                    >
                      <img src={commentMoreImage} alt="more" />
                    </button>
                  ) : null}
                </div>
                <div className="ppd-comment-list-bottom">{comment.content}</div>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </div>

        <div className="ppd-input-box">
          <input
            type="text"
            placeholder="Say something"
            className="ppd-input-field"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button type="button" className="ppd-send-btn" onClick={sendComment}>
            <img src={commentSendImage} alt="send" />
          </button>
        </div>
      </div>

      <ReportDialog open={showPostReport} onClose={() => setShowPostReport(false)} onSelect={postReportSelect} />
      <ReportDialog open={showCommentReport} onClose={() => setShowCommentReport(false)} onSelect={commentReportSelect} />
    </div>
  )
}

