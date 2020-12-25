/*
 * @Author: Whzcorcd
 * @Date: 2020-12-18 10:19:26
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-25 16:16:13
 * @Description: file content
 */
import {
  getOneRecord,
  deleteWorkflowItem,
  updateRecordAttackTime
} from '#/plugins/lowdb'
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
