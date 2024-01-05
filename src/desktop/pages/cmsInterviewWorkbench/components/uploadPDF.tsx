import React, { useEffect, useState } from 'react'
import { Module } from '@ekp-infra/common'
const Attachment = Module.getComponent('sys-attach', 'Attachment')
import pdfUpload from '/static/cms-out-images/pdfUpload.png'
import '../uploadAI/content.scss'
import { Message } from '@lui/core'

const getUploadValue = (values: any, type?: string) => {
  /** 过滤掉替换或者删除的附件 */
  // values = (values || []).filter((v) => v?.fdBindType !== 'DELETE')

  let newValue
  // let isSuccess
  if (values) {
    newValue = (values || []).map((v: any) => {
      const extendInfo = v?.fdExtendInfo ? JSON.parse(v.fdExtendInfo) : {}
      extendInfo.type = type
      return {
        ...v,
        type: type ?? 'attachment',
        fdExtendInfo: JSON.stringify(extendInfo)
      }
    })
  }
  return newValue
}
interface Iprops {
  labelName: string
  mode?: string
  configs?: {
    accept?: string
    description?: string
    maxSize?: number
  }
  onChange?: (value: any[]) => void
  value?: any[]
  onSuccessDocument?: (value: any) => void
}

/** 相关文件 */
const UploadPDF: React.FC<Iprops> = (props) => {
  const { mode = 'file', configs = {}, value = [], labelName, onChange } = props
  const [uploadData, setUploadData] = useState<any[]>([])

  useEffect(() => {
    if (value?.length) setUploadData(value)
  }, [value])

  const handleChange = (data: any[]) => {
    const uploadValue = getUploadValue(data, labelName)
    setUploadData(uploadValue)
    onChange?.(uploadValue)
  }

  return (
    <div>
      <Attachment
        key={labelName}
        mode={mode}
        {...configs}
        value={uploadData}
        fdAnonymous={true}
        onChange={(v) => {
          handleChange(v)
        }}
        showUploadList={false}
        fdEntityName='com.landray.sys.lbpa.core.entity.SysLbpaProcessTemplate'
        fdEntityKey='sysLbpaProcessTemplate'
        multiple={false}
        maxCount={1}
        type={'.pdf'}
        buttonRender={
          (<div className="body-upload">
            <div>
              <div style={{ clear: 'both' }}>
                <span className="addimg" >
                  <img src={pdfUpload} />
                </span>
              </div>
              <div className='uploadH1'>点击</div>
              <div className='uploadH2'>添加文件</div>
              <div className='uploadH3'>*仅支持PDF文件格式</div>
            </div>
          </div>)
        }
        onSuccessDocument={() => {
          Message.success('简历上传成功')
        }}
      />
    </div>
  )
}

export default UploadPDF

