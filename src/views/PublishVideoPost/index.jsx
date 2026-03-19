import React, { useRef, useState } from 'react'
import BackButton from '@/components/BackButton/index.jsx'
import { useUIStore } from '@/stores/ui'
import { usePostStore } from '@/stores/post'
import { useCurrentUserStore } from '@/stores/currentUser'
import { uploadSingleImage, uploadVideo } from '@/utils/ossUpload'
import { goBackOrClose } from '@/utils/iosBridge'

import pageBg from '@/assets/pagebgc.png'
import uploadIcon from '@/assets/uploadpic.png'

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
    if (!text.trim()) {
      ui.showToast('Please fill in the post text.')
      return
    }
    if (!uploadedVideo) {
      ui.showToast('Please select a video.')
      return
    }

    if (ui.loading) return
    ui.showLoading()

    try {
      const videoUrl = await uploadVideo(uploadedVideo, 'template_development')

      const imageBlob = await (await fetch(videoFirstFrame)).blob()
      const imageFile = new File([imageBlob], 'first_frame.png', { type: 'image/png' })
      const imageUrl = await uploadSingleImage(imageFile, 'template_development')

      const newPost = {
        dynamicId: String((posts || []).length + 1),
        userId: currentUser.userId,
        dynamicType: 1,
        dynamicDesc: text,
        dynamicTitleType: '',
        dynamicPic: [imageUrl],
        dynamicVideo: videoUrl,
        dynamicLikeCount: 0,
        dynamicCommentCount: 0,
      }

      addPost(newPost)
      ui.showToast('Post released successfully')
      goBackOrClose()
    } catch (err) {
      console.error('upload failed', err)
      ui.showToast('Upload failed, please check your network.')
    } finally {
      ui.hideLoading()
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#000',
        backgroundImage: `url(${pageBg}) no-repeat top center / cover`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      <div style={{ paddingTop: 'calc(100vh * 56 / 812)', paddingLeft: 'calc(100vw * 20 / 375)' }}>
        <BackButton />
      </div>

      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: 'calc(100vh - calc(100vh * 96 / 812))',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          style={{
            position: 'relative',
            marginTop: 'calc(100vh * 20 / 812)',
            marginLeft: 'calc(100vw * 20 / 375)',
            marginRight: 'calc(100vw * 20 / 375)',
            height: 'calc(100vh * 174 / 812)',
            borderRadius: 'calc(100vw * 16 / 375)',
            background: '#fff',
            padding: 'calc(100vw * 12 / 375)',
            boxSizing: 'border-box',
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={150}
            placeholder="Please enter"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: 'Archivo, sans-serif',
              fontSize: 'calc(100vw * 14 / 375)',
              fontWeight: 400,
              lineHeight: 'calc(100vw * 15.23 / 375)',
              background: 'transparent',
              color: '#000',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 'calc(100vw * 14 / 375)',
              bottom: 'calc(100vh * 19 / 812)',
              fontFamily: 'Archivo, sans-serif',
              fontSize: 'calc(100vw * 14 / 375)',
              color: 'rgba(105, 71, 65, 1)',
            }}
          >
            {text.length}/150
          </div>
        </div>

        <div
          style={{
            marginTop: 'calc(100vh * 24 / 812)',
            marginLeft: 'calc(100vw * 20 / 375)',
            fontFamily: 'YesevaOne, sans-serif',
            fontSize: 'calc(100vw * 20 / 375)',
            color: '#fff',
          }}
        >
          Upload（video）
        </div>

        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            marginTop: 'calc(100vh * 20 / 812)',
            paddingLeft: 'calc(100vw * 20 / 375)',
            paddingRight: 'calc(100vw * 20 / 375)',
            gap: 'calc(100vw * 10 / 375)',
          }}
        >
          {!uploadedVideo ? (
            <label
              style={{
                width: 'calc(100vw * 108 / 375)',
                height: 'calc(100vw * 108 / 375)',
                flexShrink: 0,
                borderRadius: 'calc(100vw * 20 / 375)',
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={handleAddVideo}
              />
              <img src={uploadIcon} alt="add" style={{ width: 'calc(100vw * 21 / 375)', height: 'calc(100vw * 21 / 375)' }} />
            </label>
          ) : (
            <div
              style={{
                width: 'calc(100vw * 108 / 375)',
                height: 'calc(100vw * 108 / 375)',
                flexShrink: 0,
                borderRadius: 'calc(100vw * 20 / 375)',
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(12px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={videoFirstFrame}
                alt="video preview"
                style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={handleRemoveVideo}
                style={{
                  position: 'absolute',
                  top: 'calc(100vh * 8 / 812)',
                  right: 'calc(100vw * 5 / 375)',
                  width: 'calc(100vw * 20 / 375)',
                  height: 'calc(100vw * 20 / 375)',
                  borderRadius: 999,
                  background: 'rgba(0,0,0,0.55)',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                aria-label="remove"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div
          onClick={handleRelease}
          role="button"
          tabIndex={0}
          style={{
            width: 'calc(100vw * 229 / 375)',
            height: 'calc(100vh * 62 / 812)',
            borderRadius: 'calc(100vw * 40 / 375)',
            background:
              'linear-gradient(135deg, rgba(255, 159, 142, 1) 0%, rgba(241, 213, 160, 1) 32.13%, rgba(201, 255, 221, 1) 67.84%, rgba(157, 255, 255, 1) 100%)',
            boxShadow:
              'inset calc(100vw * -2 / 375) calc(100vw * -2 / 375) calc(100vw * 2 / 375) rgba(255, 255, 255, 0.6), inset calc(100vw * 2 / 375) calc(100vw * 2 / 375) calc(100vw * 2 / 375) rgba(255, 255, 255, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'YesevaOne, sans-serif',
            fontSize: 'calc(100vw * 20 / 375)',
            fontWeight: 400,
            lineHeight: 'calc(100vw * 23.1 / 375)',
            color: 'rgba(74, 32, 25, 1)',
            cursor: 'pointer',
            margin: 'calc(100vh * 148 / 812) auto calc(100vh * 34 / 812)',
          }}
        >
          Release
        </div>
      </div>
    </div>
  )
}

