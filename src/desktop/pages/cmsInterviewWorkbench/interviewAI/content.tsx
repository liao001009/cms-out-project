// src/components/Home.tsx
import React, { useEffect, useState } from 'react'
import './content.scss'
import '../uploadAI/content.scss'
import Icon from '@lui/icons'
import ContentLeft from '../components/left'
import ContentRight from '../components/right'
import _ from 'lodash'

const Home: React.FC = () => {

  // 图片样式
  const containerStyle = {
    padding: '24px',
    background: '#eee',
    backgroundImage: `url(${mk.getResourcePath('@module:cms-out-project/desktop/static/cms-out-images/background1.png')})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  }
  const logoStyle = {
    width: '151px',
    height: '24px',
    backgroundImage: `url(${mk.getResourcePath('@module:cms-out-project/desktop/static/cms-out-images/cmsLogo.png')})`,
    backgroundSize: '151px'
  }


  const [resultData, setResultData] = useState<any>()
  // 用户名(胡斐然)
  const [fdUserName, setfdUserName] = useState<any>()

  const test = () => {
    '#'
  }
  //页面初始化
  useEffect(() => {
    const useElement = document.querySelector('.ele-page-layout-default') as unknown as HTMLElement
    useElement.style.padding = '0px'
  }, [Element])

  useEffect(() => {
    const strData = window.localStorage.getItem('resultData') || ''
    const resultData = JSON.parse(strData)

    console.log('convent接口参数=======', resultData)
    setfdUserName(mk.getSysConfig().currentUser.fdName)

    if (!_.isEmpty(resultData)) {
      setResultData(resultData)
    }

  }, [window.localStorage])

  return (
    <div className='container' style={containerStyle}>
      <div className="header">
        <div className="header-logo" style={logoStyle}></div>
        <div className="header-avatar">
          <div className='header-people'>
            <div className='header-name'>
              {fdUserName}
              {/* <Icon name="iconCommon_surface_12_arrowDown" normalize onClick={test} style={{ paddingLeft: '2px' }} /> */}
            </div>
          </div>
        </div>
      </div>
      <div className='content'>
        <ContentLeft data={resultData} />
        <ContentRight data={resultData} />
      </div>
    </div>
  )
}

export default Home
