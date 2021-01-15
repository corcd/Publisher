<!--
 * @Author: Whzcorcd
 * @Date: 2021-01-14 09:51:49
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-14 09:55:12
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
    >
      <el-form-item>
        <p class="home-form__topic">参数设置</p>
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
export default {
  name: 'EditDialog',
  data() {
    return {
      dialogVisible: false,
      id: '',
      btnDisabled: true
    }
  },
  methods: {
    open(id) {
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
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped></style>
