import * as React from 'react'
import { Message, Button, Steps} from '@lui/core'
//import Icon from '@lui/icons'
import './content.scss'
import uploadPDF from '../components/uploadPDF'


const { Step } = Steps

const Content = () => {
  const steps = [
    {
      title: '导入简历',
      content: 
        uploadPDF
      ,
      //description: '描述一',
    },
    {
      title: '等待AI处理',
      content: '步骤二内容区',
      //description: '描述二',
    },
    {
      title: '开始辅助面试',
      content: '步骤三内容区',
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

  const onChange = (current) => {
    setCurrent(current)
  }


  return (
    <div className="container">
      <div className="header">
        <div className="header-logo">logo</div>
        <div className="header-avatar">avatar</div>
      </div>
      <div className="body">
        <div className='timeline'>
          <Steps
            current={current}
            onChange={onChange}
            labelPlacement={'vertical'}
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
                onClick={() => Message.success('Processing complete!')}
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