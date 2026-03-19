import React from 'react'
import BackButton from '@/components/BackButton/index.jsx'
import MoreButton from '@/components/MoreButton/index.jsx'
import './index.css'

export default function NavBar({
  showMore = false,
  onMoreClick,
  title,
}) {
  return (
    <div className="nav-bar">
      <BackButton />
      {title ? <div className="nav-bar-title">{title}</div> : <div />}
      {showMore ? (
        <MoreButton onClick={onMoreClick} />
      ) : (
        <div className="nav-bar-placeholder" />
      )}
    </div>
  )
}