import React, { useMemo, useState } from 'react'

import NavBar from '@/components/NavBar'
import { useOtherStore } from '@/stores/other'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUIStore } from '@/stores/ui'
import { sendPaymentToIOS } from '@/utils/iosBridge'

import './index.css'
import pageBg from '@/assets/pagebgc.png'
import coinIcon from '@/assets/coin.png'
import coinsBg from '@/assets/coinsbgc.png'

export default function Coins() {
  const other = useOtherStore((s) => s.other)
  const coins = useCurrentUserStore((s) => s.currentUser?.coins ?? 0)
  const ui = useUIStore()

  const [selectedIndex, setSelectedIndex] = useState(-1)

  const list = useMemo(() => other?.coinsSetting || [], [other])

  // ✅ 只负责选中
  function handleSelect(index) {
    setSelectedIndex(index)
  }

  // ✅ 点击按钮才支付
  function handleRecharge() {
    if (selectedIndex === -1) {
      ui.showToast?.('Please select a package')
      return
    }

    const item = list[selectedIndex]
    if (!item) return

    const payKey = item.key
    sendPaymentToIOS(payKey)
  }

  return (
    <div
      className="coins-page"
      style={{ backgroundImage: `url(${pageBg}) no-repeat top center / cover` }}
    >
      <NavBar>
        <span className="coins-title">My diamonds</span>
      </NavBar>

      {/* 顶部余额 */}
      <div
        className="coins-box"
        style={{
          background:
            'linear-gradient(90deg, rgba(165, 237, 57, 1) 0%, rgba(48, 234, 255, 1) 100%)',
        }}
      >
        <div className="coins-box-header">Wallet Balance:</div>
        <div className="coins-box-content">
          <img className="coins-icon-img" src={coinIcon} alt="coin" />
          <span className="coins-number">{coins}</span>
        </div>
        <div
          className="coins-bgc"
          style={{ backgroundImage: `url(${coinsBg})` }}
          aria-hidden="true"
        />
      </div>

      {/* 列表 */}
      <div className="coins-list-wrap">
        <div className="coins-list">
          {list.map((item, index) => {
            const selected = selectedIndex === index

            return (
              <div
                key={index}
                className={`coins-item ${selected ? 'coins-item-selected' : ''}`}
                onClick={() => handleSelect(index)}
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
      <div className="coins-recharge-wrap">
        <button type="button" className="coins-recharge-btn" onClick={handleRecharge}>
          Recharge
        </button>
      </div>
    </div>
  )
}
