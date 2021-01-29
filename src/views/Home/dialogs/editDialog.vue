<!--
 * @Author: Whzcorcd
 * @Date: 2021-01-14 09:51:49
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-29 15:38:21
 * @Description: file content
-->
<template>
  <el-dialog
    title="属性编辑"
    :visible.sync="dialogVisible"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center
  >
    <el-form
      class="home-form"
      label-position="top"
      label-width="80px"
      size="mini"
      :model="attributeParams"
    >
      <el-form-item>
        <p class="home-form__topic">属性参数设置</p>
      </el-form-item>
      <el-form-item
        v-for="item in Object.keys(attributeParams)"
        :key="item"
        :label="item"
        :prop="item"
        :required="true"
      >
        <el-input
          type="text"
          size="mini"
          :placeholder="item"
          v-model="attributeParams[item]"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="default" size="mini" @click="cancel">
        取 消
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :disabled="btnDisabled"
        @click="confirm"
      >
        确 认
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import { getOneRecord } from '#/plugins/data'

export default {
  name: 'EditDialog',
  data() {
    return {
      dialogVisible: false,
      id: '',
      btnDisabled: false,
      attributeParams: {}
    }
  },
  methods: {
    open(id) {
      const { attribute } = getOneRecord(id)
      this.attributeParams = JSON.parse(JSON.stringify(attribute))

      this.id = id
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
      this.btnDisabled = false
    },
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      for (const i in this.attributeParams) {
        if (this.attributeParams.hasOwnProperty(i)) {
          if (String.prototype.trim.call(this.attributeParams[i]) === '') {
            Message.error('参数不完整，请补充后重新提交')
            return
          }
        }
      }
      this.$emit('confirm', this.id, this.attributeParams)
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-form {
    width: 100%;

    &::v-deep .home-form__topic {
      width: 100%;
      text-align: left;
      font: {
        size: 14px;
        weight: 500;
      }
    }

    &::v-deep .el-divider--horizontal {
      margin: 12px 0;
    }

    &::v-deep .el-form-item {
      margin-bottom: 0px;
      padding-bottom: 10px;
      text-align: left;
    }

    &::v-deep .el-form-item__label {
      width: 100%;
      height: 24px;
      padding: 0;
      font: {
        size: 12px;
        weight: 500;
      }
      line-height: 24px;
    }
  }
}
</style>
