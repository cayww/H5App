import React, { useMemo, useRef, useState } from 'react'
import BackButton from '@/components/BackButton.jsx'
import { useOtherStore } from '@/stores/other'
import { useUIStore } from '@/stores/ui'
import { usePostStore } from '@/stores/post'
import { useCurrentUserStore } from '@/stores/currentUser'
import { uploadMultipleImages } from '@/utils/ossUpload.js'
import { goBackOrClose } from '@/utils/iosBridge'

import pageBg from '@/assets/pagebgc.png'
import uploadIcon from '@/assets/uploadpic.png'

export default function PublishPicPost() {
  const other = useOtherStore((s) => s.other)
  const ui = useUIStore()
  const addPost = usePostStore((s) => s.addPost)
  const posts = usePostStore((s) => s.posts)
  const currentUser = useCurrentUserStore((s) => s.currentUser)

  const maxImages = 5
  const fileInputRef = useRef(null)

  const [text, setText] = useState('')
  const [selectedTheme, setSelectedTheme] = useState(0)
  const [files, setFiles] = useState([])

  const themes = useMemo(() => other?.postTheme || [], [other])

  function handleAddImage(e) {
    const picked = Array.from(e.target.files || [])
    const remaining = maxImages - files.length
    const toAdd = picked.slice(0, remaining).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setFiles((prev) => [...prev, ...toAdd])
    e.target.value = ''
  }

  function handleRemoveImage(index) {
    setFiles((prev) => {
      const next = [...prev]
      const removed = next.splice(index, 1)[0]
      if (removed?.preview) URL.revokeObjectURL(removed.preview)
      return next
    })
  }

  async function handleRelease() {
    if (!text.trim()) {
      ui.showToast('Please fill in the post text.')
      return
    }
    if (!files.length) {
      ui.showToast('Please select at least one image.')
      return
    }

    if (ui.loading) return
    ui.showLoading()

    try {
      const urls = await uploadMultipleImages(
        files.map((x) => x.file),
        'template_development',
      )

      const newPost = {
        dynamicId: String((posts || []).length + 1),
        userId: currentUser.userId,
        dynamicType: 0,
        dynamicDesc: text,
        dynamicTitleType: selectedTheme,
        dynamicPic: urls,
        dynamicVideo: '',
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
        backgroundImage: `url(${pageBg})`,
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
          Theme
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 'calc(100vw * 11 / 375)',
            marginLeft: 'calc(100vw * 20 / 375)',
            marginTop: 'calc(100vh * 20 / 812)',
            overflowX: 'auto',
            paddingRight: 'calc(100vw * 20 / 375)',
          }}
        >
          {themes.map((theme, index) => {
            const selected = selectedTheme === index
            return (
              <div
                key={index}
                onClick={() => setSelectedTheme(index)}
                role="button"
                tabIndex={0}
                style={{
                  width: 'calc(100vw * 94 / 375)',
                  height: 'calc(100vh * 44 / 812)',
                  borderRadius: 'calc(100vw * 20 / 375)',
                  background: selected
                    ? 'linear-gradient(135deg, rgba(255, 159, 142, 1) 0%, rgba(241, 213, 160, 1) 32.13%, rgba(201, 255, 221, 1) 67.84%, rgba(157, 255, 255, 1) 100%)'
                    : 'rgba(255, 255, 255, 0.16)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'Archivo, sans-serif',
                  fontSize: 'calc(100vw * 14 / 375)',
                  color: selected ? 'rgba(74, 32, 25, 1)' : '#fff',
                  flexShrink: 0,
                  cursor: 'pointer',
                }}
              >
                # {theme}
              </div>
            )
          })}
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
          Upload（Pic）
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
          {files.length < maxImages ? (
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
              }}
            >
              <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleAddImage} />
              <img src={uploadIcon} alt="add" style={{ width: 'calc(100vw * 21 / 375)', height: 'calc(100vw * 21 / 375)' }} />
            </label>
          ) : null}

          {files.map((x, index) => (
            <div
              key={index}
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
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 'inherit',
                  backgroundImage: `url(${x.preview})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
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
          ))}
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
            margin: 'calc(100vh * 117 / 812) auto calc(100vh * 34 / 812)',
          }}
        >
          Release
        </div>
      </div>
    </div>
  )
}

