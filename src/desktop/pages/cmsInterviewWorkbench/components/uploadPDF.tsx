// src/components/Home.tsx
import React from 'react'
import { Message, Upload } from '@lui/core'
import pdfUpload from '../img/pdfUpload.png'


const UploadPDF: React.FC = () => {
  const props = {
    name: 'file',
    action: 'https://mkzszq.ywork.me/data/sys-attach/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange (info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        Message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        Message.error(`${info.file.name} file upload failed.`)
      }
    },
  }
  return (
    <div className="body-upload">
      <Upload
        listType={'picture-card'}
        {...props}
        accept={'.txt,.pdf'}
        sortableZone={'default'}
        maxCount = {1}
      >
        <div>
          <span className="addimg">
            <img src={pdfUpload}/>
          </span>
          <br />
        *仅支持PDF文件格式
        </div>
      </Upload>
    </div>
  )
}

export default UploadPDF
