import React, { useRef, useState } from 'react'
import BackButton from '@/components/BackButton/index.jsx'
import { useUIStore } from '@/stores/ui'
import { usePostStore } from '@/stores/post'
import { useCurrentUserStore } from '@/stores/currentUser'
import { uploadSingleImage, uploadVideo } from '@/utils/ossUpload'
import { goBackOrClose } from '@/utils/iosBridge'

import pageBg from '@/assets/pagebgc.png'
import uploadIcon from '@/assets/uploadpic.png'

import './index.css'

export default function PublishVideoPost() {
  const ui = useUIStore()
  const addPost = usePostStore((s) => s.addPost)
  const posts = usePostStore((s) => s.posts)
  const currentUser = useCurrentUserStore((s) => s.currentUser)

  const fileInputRef = useRef(null)

  const [text, setText] = useState('')
  const [uploadedVideo, setUploadedVideo] = useState(null)
  const [videoFirstFrame, setVideoFirstFrame] = useState('')

  async function handleAddVideo(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedVideo(file)

    const video = document.createElement('video')
    video.src = URL.createObjectURL(file)
    video.muted = true
    video.playsInline = true

    video.addEventListener(
      'loadeddata',
      () => {
        video.currentTime = 0
      },
      { once: true },
    )

    video.addEventListener(
      'seeked',
      () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        setVideoFirstFrame(canvas.toDataURL('image/png'))
      },
      { once: true },
    )

    e.target.value = ''
  }

  function handleRemoveVideo() {
    setUploadedVideo(null)
    setVideoFirstFrame('')
  }

  async function handleRelease() {
    if (!text.trim()) return ui.showToast('Please fill in the post text.')
    if (!uploadedVideo) return ui.showToast('Please select a video.')

    if (ui.loading) return
    ui.showLoading()

    try {
      const videoUrl = await uploadVideo(uploadedVideo, 'template_development')

      const imageBlob = await (await fetch(videoFirstFrame)).blob()
      const imageFile = new File([imageBlob], 'first_frame.png', { type: 'image/png' })
      const imageUrl = await uploadSingleImage(imageFile, 'template_development')

      addPost({
        dynamicId: String((posts || []).length + 1),
        userId: currentUser.userId,
        dynamicType: 1,
        dynamicDesc: text,
        dynamicTitleType: '',
        dynamicPic: [imageUrl],
        dynamicVideo: videoUrl,
        dynamicLikeCount: 0,
        dynamicCommentCount: 0,
      })

      ui.showToast('Post released successfully')
      goBackOrClose()
    } catch {
      ui.showToast('Upload failed, please check your network.')
    } finally {
      ui.hideLoading()
    }
  }

  return (
    <div className="publish" style={{ backgroundImage: `url(${pageBg})` }}>
      <div className="publish-header">
        <BackButton />
      </div>

      <div className="publish-scroll">
        <div className="publish-text-box">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={150}
            placeholder="Please enter"
          />
          <div className="publish-count">{text.length}/150</div>
        </div>

        <div className="publish-title">Upload（video）</div>

        <div className="publish-upload">
          {!uploadedVideo ? (
            <label className="upload-box">
              <input ref={fileInputRef} type="file" accept="video/*" onChange={handleAddVideo} />
              <img src={uploadIcon} alt="add" className="upload-icon" />
            </label>
          ) : (
            <div className="upload-box">
              <img src={videoFirstFrame} alt="" className="preview" />
              <button className="remove-btn" onClick={handleRemoveVideo}>
                ×
              </button>
            </div>
          )}
        </div>

        <div className="publish-btn" onClick={handleRelease}>
          Release
        </div>
      </div>
    </div>
  )
}
