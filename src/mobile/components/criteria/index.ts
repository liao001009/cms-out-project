import InnerCriteria, { IProps } from './criteria'
import AddressCriterion from './item/address'
import CalendarCriterion from './item/calendar'
import InputCriterion from './item/input'
import OptionsCriterion from './item/options'
import BooleanCriterion from './item/boolean'

interface CompoundedComponent extends React.FC<IProps> {
  // 内置地址本、时间、文本型、选项型、布尔型筛选器
  Address: typeof AddressCriterion
  Calendar: typeof CalendarCriterion
  Input: typeof InputCriterion
  Options: typeof OptionsCriterion
  Boolean: typeof BooleanCriterion
}

const Criteria = InnerCriteria as CompoundedComponent
Criteria.Address = AddressCriterion
Criteria.Calendar = CalendarCriterion
Criteria.Input = InputCriterion
Criteria.Options = OptionsCriterion
Criteria.Boolean = BooleanCriterion

export { IProps, AddressCriterion, CalendarCriterion, InputCriterion, OptionsCriterion, BooleanCriterion }
export default Criteria
