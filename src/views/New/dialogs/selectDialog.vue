<!--
 * @Author: Whzcorcd
 * @Date: 2021-01-13 15:23:08
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-13 17:00:38
 * @Description: file content
-->
<template>
  <el-dialog
    title="项目选择"
    :visible.sync="dialogVisible"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center
  >
    <el-form
      class="new-form"
      label-position="top"
      label-width="80px"
      size="mini"
    >
      <el-form-item>
        <p class="new-form__topic">可选项目存在多个，选择其一</p>
      </el-form-item>
      <el-form-item v-for="item in selectArray" :key="item.id">
        <section
          class="new-card"
          @click="confirm(item.id, item.name, item.web_url)"
        >
          <p>{{ item.name }}</p>
        </section>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="default" size="mini" @click="cancel">
        取 消
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'SelectDialog',
  data() {
    return {
      dialogVisible: false,
      btnDisabled: true,
      selectArray: []
    }
  },
  methods: {
    open(arr) {
      this.selectArray.push(...arr)
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
      this.btnDisabled = false
      this.selectArray = []
    },
    cancel() {
      this.$emit('cancel')
    },
    confirm(id, name, url) {
      this.$emit('confirm', { id, name, url })
    }
  }
}
</script>

<style lang="scss" scoped>
.new {
  &-form {
    width: 100%;

    &::v-deep .new-form__topic {
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

  &-card {
    width: 100%;
    height: 50px;
    color: #333;
    font: {
      size: 16px;
      weight: 500;
    }
    text-align: center;
    border: 1px solid #dedede;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px;
    transition: all 0.2s linear;
    cursor: pointer;

    &:hover {
      color: #fff;
      background-color: #0064c8;
    }

    p {
      width: 100%;
      height: 100%;
      line-height: 50px;
    }
  }
}
</style>
