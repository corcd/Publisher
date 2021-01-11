<!--
 * @Author: Whzcorcd
 * @Date: 2021-01-06 12:45:23
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-11 15:37:50
 * @Description: file content
-->
<template>
  <div class="check">
    <Topbar @change="freshData"></Topbar>
    <Searchbar title="相关邮件"></Searchbar>
    <section>
      <div class="check-leftarea">
        <div class="check-list" v-if="mailList.length > 0">
          <div
            :class="[
              'check-list__item',
              { 'check-list__item--chosen': item.uid === activeUid },
              { 'check-list__item--replied': isReplied(item.uid) }
            ]"
            v-for="item in mailList"
            :key="item.uid"
            @click="chooseMail(item.uid)"
          >
            <p class="check-list__item-title">
              <span
                :class="[
                  {
                    prod: processedTitle(item.subject)[1].includes('生产')
                  },
                  {
                    pre: processedTitle(item.subject)[1].includes('预发')
                  },
                  {
                    test: processedTitle(item.subject)[1].includes('测试')
                  }
                ]"
              >
                {{ processedTitle(item.subject)[1] }}
              </span>
              {{ processedTitle(item.subject)[3] }}
              <span
                class="check-list__item-title-status"
                v-if="isReplied(item.uid)"
              >
                <i class="el-icon-check"></i>
                已确认
              </span>
            </p>
            <p class="check-list__item-subtitle">
              {{ formatDate(item.date) }}
              {{ processedTitle(item.subject)[4] }}
              (via Publisher{{
                processedTitle(item.subject)[5]
                  ? `&lt;${processedTitle(item.subject)[5]}&gt;`
                  : ''
              }})
            </p>
          </div>
        </div>
        <div class="check-text" v-else>
          <span v-if="listLoading">邮件数据加载中</span>
          <span v-else>24 小时内暂无来自 Publisher 的云平台发布邮件</span>
        </div>
      </div>
      <div class="check-rightarea">
        <h4>{{ currentMailContent.subject }}</h4>
        <pre>{{ currentMailContent.html }}</pre>
        <div class="check-rightarea__controls" v-show="activeUid">
          <el-button
            type="primary"
            size="mini"
            :loading="btnLoading"
            @click="replyEmail"
          >
            确认更新
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Message } from 'element-ui'
import { isEqual } from 'lodash-es'
import dayjs from 'dayjs'
import {
  receiveEmail,
  setEmailSeen,
  setEmailAnswered,
  replyEmail
} from '#/plugins/email'
import Topbar from '@/components/check/topbar'
import Searchbar from '@/components/home/searchbar'

export default {
  name: 'Check',
  components: { Topbar, Searchbar },
  data() {
    return {
      listLoading: false,
      btnLoading: false,
      mailList: [],
      replayList: [],
      activeUid: 0,
      timer: null
    }
  },
  computed: {
    processedTitle() {
      return originalTitle => {
        const main = originalTitle.includes('Publisher')
          ? originalTitle.match(/\[(\S*)\] (\S*)-(\S*)-(\S*) Publisher<(\S*)>/i)
          : originalTitle.match(/\[(\S*)\] (\S*)-(\S*)-(\S*)/i)
        return main
      }
    },
    currentMailContent() {
      if (!this.activeUid) return ''
      const mail = this.mailList.find(item => item.uid === this.activeUid)
      return mail
    },
    formatDate() {
      return date => {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    isReplied() {
      return uid => {
        return this.replayList.find(item => item.uid === uid)
      }
    }
  },
  mounted() {
    clearTimeout(this.timer)
    this.timer = null

    this.freshData()
    this.setTimer()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    ...mapActions('email', ['setNewMailStatus']),
    setTimer() {
      this.timer = setTimeout(() => {
        this.freshData()
        return this.setTimer()
      }, 10000)
    },
    async freshData() {
      const {
        filteredUpdateSubjects,
        filteredReplySubjects
      } = await receiveEmail().catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
      this.setNewMailStatus({ status: false })
      const finalReplySubjects = filteredReplySubjects.reverse()
      const replaiedMailIdList = finalReplySubjects.map(mail => {
        try {
          return this.processedTitle(mail.subject)[5]
        } catch (err) {
          return ''
        }
      })
      // console.log(replaiedMailIdList)
      const finalUpdateSubjects = filteredUpdateSubjects
        .reverse()
        .filter(mail => {
          try {
            const id = this.processedTitle(mail.subject)[5]
            if (id && replaiedMailIdList.includes(id)) return false
          } catch (err) {
            // nothing
          }
          return true
        })

      // 比较新旧邮件列表是否存在差异
      const currectMailList = JSON.parse(JSON.stringify(this.mailList))
      const tempList = []
      tempList.push(...finalReplySubjects, ...finalUpdateSubjects)
      if (isEqual(currectMailList, JSON.parse(JSON.stringify(tempList)))) {
        Message.info('暂无更新的邮件')
        return
      }
      this.listLoading = true

      this.setNewMailStatus({ status: true })
      this.mailList = []
      this.replayList = []

      this.replayList.push(...finalReplySubjects)
      this.mailList.push(...finalUpdateSubjects)
      this.mailList.unshift(...finalReplySubjects)

      if (!this.mailList.find(item => item.uid === this.activeUid)) {
        this.activeUid = 0
      }

      this.listLoading = false
    },
    async chooseMail(uid) {
      try {
        if (this.replayList.find(item => item.uid === uid)) return
        this.activeUid = uid
        await setEmailSeen(uid)
      } catch (err) {
        console.error(err)
      }
    },
    async replyEmail() {
      this.btnLoading = true
      try {
        const { messageId, subject } = this.mailList.find(
          item => item.uid === this.activeUid
        )

        await setEmailAnswered(this.activeUid)
        await replyEmail(messageId, subject)
      } catch (err) {
        console.error(err)
      }
      this.btnLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.check {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  &-leftarea {
    width: 30%;
    height: 100%;
    overflow: hidden;

    ::-webkit-scrollbar {
      width: 0 !important;
    }
  }

  &-rightarea {
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: 0 0 0 20px;
    border: 1px solid #dadce0;
    border-radius: 8px;
    box-shadow: none;
    overflow: hidden;

    h4 {
      width: 100%;
      margin: 0 0 10px 0;
      padding: 10px 16px;
      font: {
        size: 16px;
      }
    }

    pre {
      flex-grow: 1;
      width: 100%;
      padding: 16px;
      font: {
        size: 14px;
      }
      text-align: left;
    }

    &__controls {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 6px 12px;
      background-color: #efefef;
    }
  }

  &-text {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font: {
      size: 12px;
      weight: 500;
    }
    text-align: center;
  }

  &-list {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    &__item {
      width: 100%;
      height: 46px;
      margin: 0 0 8px 0;
      padding: 6px 12px;
      border: 1px solid #dadce0;
      border-radius: 8px;
      box-shadow: none;
      transition: all 0.3s linear;
      cursor: pointer;

      &--chosen,
      &:hover {
        border: 1px solid #0064c8;
      }

      &--replied {
        cursor: not-allowed;
      }

      &-title {
        position: relative;
        width: 100%;
        font: {
          size: 12px;
          weight: 500;
        }
        text-align: left;

        span.test {
          color: green;
        }
        span.pre {
          color: purple;
        }
        span.prod {
          color: orange;
        }

        &-status {
          position: absolute;
          right: 0;
          padding: 0 2px;
          color: #fff;
          font: {
            size: 10px;
            weight: 500;
          }
          text-align: right;
          background-color: #0064c8;
          border-radius: 2px;
        }
      }

      &-subtitle {
        width: 100%;
        color: #999;
        font: {
          size: 10px;
          weight: 500;
        }
        text-align: left;
      }
    }
  }

  section {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 18px 36px;
    overflow: hidden;
  }
}
</style>
