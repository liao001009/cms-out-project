// src/components/Home.tsx
import React, { useEffect, useState } from 'react'
import './content.scss'
import '../uploadAI/content.scss'
import Icon from '@lui/icons'
import ContentLeft from '../components/left'
import ContentRight from '../components/right'
import _ from 'lodash'
const Home: React.FC = () => {
  const [rightData, setRightData] = useState<any>(null)
  // 用户名(胡斐然)
  const [fdUserName, setfdUserName] = useState<any>()
  //页面初始化
  useEffect(() => {
    const strData = window.localStorage.getItem('resultData') || ''
    const resultData = JSON.parse(strData)

    console.log('convent接口参数=======', resultData)

    const element = document.querySelector('.ele-page-layout-default') as unknown as HTMLElement
    element.style.padding = '0px'
    setfdUserName(mk.getSysConfig().currentUser.fdName)

    if (!_.isEmpty(resultData)) {
      setRightData(resultData)
    }

  }, [window.localStorage])

  return (
    <div className='container'>
      <div className="header">
        <div className="header-logo"></div>
        <div className="header-avatar">
          <div className='header-people'></div>
          <div className='header-name'>{fdUserName}</div>
          <div className='farme'>
            <Icon name="iconCommon_surface_12_arrowDown" normalize />
          </div>
        </div>
      </div>
      <div className='content'>
        <ContentLeft />
        <ContentRight data={rightData} />
      </div>
    </div>
  )
}

export default Home
