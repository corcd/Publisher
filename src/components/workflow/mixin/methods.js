/*
 * @Author: Whzcorcd
 * @Date: 2020-12-18 10:19:26
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-25 02:06:58
 * @Description: file content
 */
import { getOneRecord, deleteWorkflowItem } from '#/plugins/lowdb'
import { runOneTask } from '@/modules/task'

const methods = {
  props: {
    id: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: null
    }
  },
  methods: {
    runAction() {
      // FIXME 思考：单任务执行时，是否需要考虑全局 projectName 和 jobName
      const { projectName, jobName } = getOneRecord(this.id)
      runOneTask({
        action: this.workflowItemName,
        params: Object.assign({}, this.params, { projectName, jobName })
      })
    },
    deleteWorkflowItem() {
      deleteWorkflowItem({ id: this.id, action: this.workflowItemName })
      this.$emit('refresh')
    },
    setParams() {
      this.$emit('set', this.workflowItemName)
    },
    insert() {
      this.$emit('insert', this.workflowItemName)
    }
  }
}

export default methods
