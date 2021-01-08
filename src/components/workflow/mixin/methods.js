/*
 * @Author: Whzcorcd
 * @Date: 2020-12-18 10:19:26
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-06 11:38:47
 * @Description: file content
 */
import {
  getOneRecord,
  updateRecordAttackTime,
  deleteWorkflowItem
} from '#/plugins/data'
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
    async runAction() {
      const { attribute } = getOneRecord(this.id)
      try {
        await runOneTask({
          id: this.id,
          action: this.workflowItemName,
          params: Object.assign({}, this.params, { ...attribute })
        })
        updateRecordAttackTime({ id: this.id })
      } catch (err) {
        console.error(err)
      }
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
