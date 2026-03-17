import React from 'react'
import { Modal } from 'antd-mobile'
import bgcImage from '@/assets/reportdialogbgc.png'
import optionsBgImage from '@/assets/reportchoosebgc.png'

export default function ReportDialog({ open, onClose, onSelect }) {
  return (
    <Modal
      visible={open}
      onClose={onClose}
      closeOnMaskClick
      bodyStyle={{
        padding: 0,
        background: `url(${bgcImage}) center/cover no-repeat`,
        borderRadius: 'calc(100vw * 20 / 375)',
      }}
      content={
        <div style={{ padding: 'calc(100vh * 36 / 812) calc(100vw * 28 / 375)' }}>
          <div
            style={{
              background: `url(${optionsBgImage}) center/cover no-repeat`,
              padding: 'calc(100vh * 26 / 812) 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'calc(100vh * 26 / 812)',
            }}
          >
            <button
              type="button"
              style={optionStyle}
              onClick={() => {
                onSelect?.(0)
                onClose?.()
              }}
            >
              Report
            </button>
            <button
              type="button"
              style={optionStyle}
              onClick={() => {
                onSelect?.(1)
                onClose?.()
              }}
            >
              Shield
            </button>
          </div>

          <div style={{ height: 'calc(100vh * 26 / 812)' }} />

          <button type="button" style={cancelStyle} onClick={onClose}>
            Cancel
          </button>
        </div>
      }
    />
  )
}

const optionStyle = {
  width: '100%',
  height: '48px',
  borderRadius: 999,
  background: '#fff',
  border: 'none',
  boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
  fontFamily: 'Archivo, sans-serif',
  fontSize: 16,
  color: 'rgba(74, 32, 25, 1)',
}

const cancelStyle = {
  width: '100%',
  height: '52px',
  borderRadius: 999,
  background: 'rgba(255, 255, 255, 0.4)',
  border: 'none',
  fontFamily: 'YesevaOne, sans-serif',
  fontSize: 18,
  color: 'rgba(74, 32, 25, 1)',
}

