<!--
 * @Author: Whzcorcd
 * @Date: 2021-01-06 12:45:23
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-08 17:30:24
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
        <div class="check-rightarea__controls">
          <el-button type="primary" size="mini" @click="replyEmail">
            确认更新
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { receiveEmail, setEmailSeen, replyEmail } from '@/app/email'
import Topbar from '@/components/home/topbar'
import Searchbar from '@/components/home/searchbar'

export default {
  name: 'Check',
  components: { Topbar, Searchbar },
  data() {
    return {
      listLoading: false,
      mailList: [],
      replayList: [],
      activeUid: 0
    }
  },
  computed: {
    processedTitle() {
      return originalTitle => {
        const main = originalTitle.includes('Publisher')
          ? originalTitle.match(/\[(\S*)\] (\S*)-(\S*)-(\S*) Publisher<(\S*)>/i)
          : originalTitle.match(/\[(\S*)\] (\S*)-(\S*)-(\S*)/i)
        console.log(main)
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
    this.freshData()
  },
  methods: {
    async freshData() {
      this.listLoading = true
      this.activeUid = 0
      const {
        filteredSubjects,
        filteredReplySubjects
      } = await receiveEmail().catch(err => console.error(err))
      this.mailList = filteredSubjects.reverse()
      this.replayList = filteredReplySubjects.reverse()
      this.mailList.unshift(...this.replayList)
      this.listLoading = false
    },
    chooseMail(uid) {
      if (this.replayList.find(item => item.uid === uid)) return
      this.activeUid = uid
      setEmailSeen(uid)
    },
    replyEmail() {
      const { messageId, subject } = this.mailList.find(
        item => item.uid === this.activeUid
      )

      replyEmail(messageId, subject)
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
