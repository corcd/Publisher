<!--
 * @Author: Whzcorcd
 * @Date: 2021-01-11 09:25:30
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-11 09:27:04
 * @Description: file content
-->
<template>
  <div class="topbar">
    <section>
      <span>Publisher</span>
      <div>
        <el-button
          icon="el-icon-warning-outline"
          size="mini"
          circle
          @click="lead2AboutPage"
        ></el-button>
        <el-button
          type="default"
          icon="el-icon-refresh"
          size="mini"
          circle
          @click="fresh"
        ></el-button>
        <el-button
          icon="el-icon-setting"
          size="mini"
          circle
          @click="lead2SettingsPage"
        ></el-button>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUser } from '#/plugins/data'

export default {
  name: 'Topbar',
  data() {
    return {
      userInfo: getUser()
    }
  },
  computed: {
    ...mapGetters('email', ['hasNewMail'])
  },
  methods: {
    fresh() {
      this.$emit('change')
    },
    lead2AboutPage() {
      this.$router.push({ name: 'About' })
    },
    lead2NewPage() {
      this.$router.push({ name: 'New' })
    },
    lead2SettingsPage() {
      this.$router.push({ name: 'Settings' })
    }
  }
}
</script>

<style lang="scss" scoped>
.topbar {
  width: 100%;
  height: 60px;
  background-color: #0064c8;

  &-popover {
    &__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      font: {
        size: 10px;
      }
    }

    &__title {
      padding-top: 10px;
      font: {
        size: 12px;
        weight: 500;
      }

      &:first-child {
        padding: 0;
      }
    }
  }

  section {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    span {
      color: #fff;
      font: {
        size: 22px;
        weight: bold;
      }
    }

    button {
      margin: 0 0 0 10px;
    }
  }
}
</style>
