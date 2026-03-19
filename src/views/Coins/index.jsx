import React, { useMemo, useState } from 'react'

import BackButton from '@/components/BackButton/index.jsx'
import { useOtherStore } from '@/stores/other'
import { useCurrentUserStore } from '@/stores/currentUser'
import { sendPaymentToIOS } from '@/utils/iosBridge'

import './coins.css'
import pageBg from '@/assets/pagebgc.png'
import coinIcon from '@/assets/coin.png'
import coinBoxBg from '@/assets/coinbgc.png'
import coinsBg from '@/assets/coinsbgc.png'

export default function Coins() {
  const other = useOtherStore((s) => s.other)
  const coins = useCurrentUserStore((s) => s.currentUser?.coins ?? 0)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const list = useMemo(() => other?.coinsSetting || [], [other])

  function handleCoinClick(item, index) {
    setSelectedIndex(index)
    const payKey = item.key
    sendPaymentToIOS(payKey)
  }

  return (
    <div className="coins-page" style={{ backgroundImage: `url(${pageBg}) no-repeat top center / cover` }}>
      <div className="coins-top-header">
        <BackButton />
        <span className="coins-title">My diamonds</span>
      </div>

      <div className="coins-box" style={{ backgroundImage: `url(${coinBoxBg})` }}>
        <div className="coins-box-header">My diamonds</div>
        <div className="coins-box-content">
          <img className="coins-icon-img" src={coinIcon} alt="coin" />
          <span className="coins-number">{coins}</span>
        </div>
      </div>

      <div className="coins-bgc" style={{ backgroundImage: `url(${coinsBg})` }} aria-hidden="true" />

      <div className="coins-list-wrap">
        <div className="coins-list">
          {list.map((item, index) => {
            const selected = selectedIndex === index
            return (
              <div
                key={index}
                className={`coins-item ${selected ? 'coins-item-selected' : ''}`}
                onClick={() => handleCoinClick(item, index)}
                role="button"
                tabIndex={0}
              >
                <div className="coins-left">
                  <img className="coins-item-icon-img" src={coinIcon} alt="coin" />
                  <span className={`coins-count ${selected ? 'coins-count-selected' : ''}`}>
                    {item.cions}
                  </span>
                </div>

                <div className="coins-right">
                  <span className={`coins-price ${selected ? 'coins-price-selected' : ''}`}>
                    {item.money}
                  </span>
                  <div className={`coins-radio ${selected ? 'coins-radio-selected' : ''}`} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

