import React from 'react'
import BackButton from '@/components/BackButton/index.jsx'
import MoreButton from '@/components/MoreButton/index.jsx'
import './index.css'

export default function NavBar({ showMore = false, onMoreClick, children }) {
  return (
    <div className="nav-bar">
      <BackButton />
      {children}
      {showMore ? <MoreButton onClick={onMoreClick} /> : <div className="nav-bar-placeholder" />}
    </div>
  )
}
