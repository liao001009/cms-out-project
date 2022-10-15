import { Modal, Upload } from '@lui/core'
import Icon from '@lui/icons'
import React from 'react'
import XLSX from 'xlsx'

const XformExecl: React.FC<any> = (props) => {
  const { onChange , handleCancel, visible, errMsgArr=[]} = props
  const footer = (
    <div>
      {/* <Button type="primary" htmlType="button">
        确认
      </Button>
      <Button onClick={handleCancel}>取消</Button> */}
    </div>
  )
  const importExecl = (request) => {
    //使用promise导入
    return new Promise((resolve, reject) => {
      // 通过FileReader对象读取文件
      const fileReader = new FileReader()
      fileReader.onload = event => { //异步操作  excel文件加载完成以后触发
        try {
          // @ts-ignore
          const { result } = event.target
          // 以二进制流方式读取得到整份excel表格对象
          const workbook = XLSX.read(result, { type: 'binary' })
          const data = [] // 存储获取到的数据
          // 遍历每张工作表进行读取（这里默认只读取第一张表）
          for (const sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              data[sheet] =  XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            }
          }
          resolve(data)//导出数据
        } catch (e) {
          // 这里可以抛出文件类型错误不正确的相关提示
          reject({ data: { msg: '转换失败，请检查文件！！！' } })//导出失败
        }
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(request.file)
    })
  }
  return (
    <div style={{ width: '150px', margin: '4px' }}>
      <Modal
        fixedHeight={false}
        visible={visible}
        title={'上传文件'}
        footer={footer}
        modalType={'small'}
        onCancel={handleCancel}
      >
        <Upload
          name='file'
          accept='.xlsx'
          maxCount={1}
          // action={'https://www.mocky.io/v2/5cc8019d300000980a055e76'}
          // action={mk.getSysConfig('modulesUrlPrefix') +'/#/desktop/pages/cmsProjectWritten/attach'}
          customRequest={(request)=>{
            importExecl(request).then((data)=>{
              onChange(data)
            })
          }}
          onChange={(info)=>{
            info.file.status = 'done'
          }}
        >
          <span className="uploadIcon">
            <Icon name="iconCommon_line_16_upload" normalize />
          </span>
          选择文件
          {
            errMsgArr.length >0 ? (
              <div style={{ color: '#999999', fontSize: 12, paddingTop: 3 }}>
                <Icon name='iconCommon_line_12_information' normalize style={{color: 'red'}} />
                <span style={{ paddingLeft: 4, color: 'red' }}>
                  无法导入： {errMsgArr.map(i =>{
                    return i +';'
                  })}
                </span>
              </div>
            )
              : null

          }
          {/* <Icon name="iconCommon_line_12_information" normalize /> */}
          {/* <span style={{ paddingLeft: 4 }}>
          </span> */}
        </Upload>
      </Modal>
    </div>
  )
}
export default XformExecl 