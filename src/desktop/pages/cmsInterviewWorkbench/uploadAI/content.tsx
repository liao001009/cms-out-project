import React, { useEffect } from 'react'
import { Message, Button, Steps } from '@lui/core'
import Icon from '@lui/icons'
import './content.scss'
import UploadPDF from '../components/uploadPDF'
// import UploadLoading from '../img/loading.gif'
const { Step } = Steps

const Content = () => {
  //页面初始化
  // eslint-disable-next-line @typescript-eslint/no-empty-function  
  useEffect(() => {
  }, [])
  const steps = [
    {
      title: '导入简历',
      content:
        (<UploadPDF />)
      ,
      //description: '描述一',
    },
    {
      title: '等待AI处理',
      content: (
        <div className='loading'>
          <div>
            <div className='loadingImage'></div>
            <div className='loadingH1'>大模型处理中，请稍后...</div>
            <div className='loadingH2'>王小军-高级Java开发工程师-2023简历.pdf</div>
          </div>
        </div>
      ),
      //description: '描述二',
    },
    {
      title: '开始辅助面试',
      content: (
        <div className='finish'>
          <div>
            {/* <div className='lui-steps-item-icon'>
              <span className="lui-steps-icon">
                <i className="lui-icon lui-icon-iconCommon_line_16_signTick lui-steps-finish-icon lui-icon-16">
                  <span role="img" className="lui-action">
                    <svg className="icon vector-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" href="http://www.w3.org/1999/xlink">
                      <use href="#iconCommon_line_16_signTick" id="svgUse-#iconCommon_line_16_signTick">
                      </use>
                    </svg>
                  </span>
                </i>
              </span>
            </div> */}
            <div className='finishImage'></div>
            <div className='finishH1'>处理完成，即将开始辅助面试</div>
            <div className='finishH2'>王小军-高级Java开发工程师-2023简历.pdf</div>
          </div>
        </div>
      ),
      //description: '描述三',
    },
  ]
  const [current, setCurrent] = React.useState(0)
  //下一步
  const next = () => {
    setCurrent(current + 1)
  }
  //上一步
  const prev = () => {
    setCurrent(current - 1)
  }

  // AI面试工作台
  const handleInterview = () => {
    Message.success('Processing complete!')
    window.location.href = 'http://127.0.0.1:3136/cms-out-manage/desktop/#/cmsInterviewWorkbench/interviewAI'
    // history.replaceTo('/cmsInterviewWorkbench/uploadAI')
    // mk.openLink({
    //   url: 'http://127.0.0.1:3136/cms-out-manage/desktop/#/cmsInterviewWorkbench/interviewAI',
    //   target: '_blank'
    // })
  }

  const onChange = (current) => {
    setCurrent(current)
  }

  const test = () => {
    '#'
  }
  return (
    <div className="container">
      <div className="header">
        <div className="header-logo"></div>
        <div className="header-avatar">
          <div className='header-people'></div>
          <div className='header-name'>李逍遥</div>
          <div className='farme'>
            <Icon name="iconCommon_surface_12_arrowDown" normalize onClick={test} />
          </div>
        </div>
      </div>
      <div className="body">
        <div className='timeline'>
          <Steps
            current={current}
            onChange={onChange}
            labelPlacement={'horizontal'}
            size={'small'}
          >
            {steps.map((item) => (
              <Step
                key={item.title}
                title={item.title}
                disabled
              //description={item.description}
              />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
          <div className="steps-action">
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                上一步
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => handleInterview()}
              >
                提交
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Content