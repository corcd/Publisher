/*
 * @Author: Whzcorcd
 * @Date: 2020-12-18 10:19:26
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-18 10:45:37
 * @Description: file content
 */
import { deleteWorkflowItem } from '#/plugins/lowdb'
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
      runOneTask({ action: this.workflowItemName, params: this.params })
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
