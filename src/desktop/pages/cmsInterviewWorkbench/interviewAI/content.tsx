// src/components/Home.tsx
import React, { useEffect } from 'react'
import './content.scss'
import '../uploadAI/content.scss'
import Icon from '@lui/icons'
import ContentLeft from '../components/left'
import ContentRight from '../components/right'

const Home: React.FC = () => {
  //页面初始化
  useEffect(() => {
    const element = document.querySelector('.ele-page-layout-default') as unknown as HTMLElement
    element.style.padding='0px'
  }, [])
  return (
    <div className='container'>
      <div className="header">
        <div className="header-logo"></div>
        <div className="header-avatar">
          <div className='header-people'></div>
          <div className='header-name'>李逍遥</div>
          <div className='farme'>
            <Icon name="iconCommon_surface_12_arrowDown" normalize/>
          </div>
        </div>
      </div>
      <div className='content'>
        <ContentLeft />
        <ContentRight />
      </div>
    </div>
  )
}

export default Home
