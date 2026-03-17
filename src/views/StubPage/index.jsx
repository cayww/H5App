import React from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'

export default function StubPage({ title }) {
  const params = useParams()
  const location = useLocation()

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 18, fontWeight: 600 }}>{title}（待迁移）</div>
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
        <div>path: {location.pathname}</div>
        <div>params: {JSON.stringify(params)}</div>
      </div>
      <div style={{ marginTop: 12 }}>
        <Link to="/">回到 Home</Link>
      </div>
    </div>
  )
}

