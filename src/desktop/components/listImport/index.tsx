import { Module } from '@ekp-infra/common'
import { Modal } from '@lui/core'
import React from 'React'
const Import = Module.getComponent('sys-mech-transport', 'Import')

export interface IProps {
  /** fdEntityName */
  fdEntityName?:string
  /** 取消 */
  onCancle?:(v)=>void
  /** 显隐 */
  visible:boolean
}

const ListImport: React.FC<IProps> = (props) => {
  const { visible=false,onCancle,fdEntityName } = props
  return (
    <Modal
      visible={visible}
      title='导入'
      onCancel={()=>onCancle && onCancle(false)}
      modalType='oversized'
      footer={null}
      destroyOnClose
    >
      <Import 
        isDefault={false}
        isMasterTemplate={true}
        fdEntityName={fdEntityName}
      />
    </Modal>
  )
}

export default ListImport