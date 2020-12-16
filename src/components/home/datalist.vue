<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-16 11:54:39
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-16 13:50:51
 * @Description: file content
-->
<template>
  <section class="datalist">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item
        v-for="item in recordsData"
        :key="item.id"
        :name="item.id"
      >
        <template slot="title">
          {{ getTitle({ name: item.name, jobName: item.jobName }) }}
          <i
            class="home-collapse__headericon home-collapse__headericon--completed el-icon-circle-check"
            v-if="getRecordStatus(item.id) === 'completed'"
          ></i>
          <i
            class="home-collapse__headericon home-collapse__headericon--error el-icon-circle-check"
            v-if="getRecordStatus(item.id) === 'error'"
          ></i>
        </template>
        <div class="home-collapse">
          <div class="home-collapse__left">
            <p class="home-collapse__details">
              最近一次构建:
              {{
                `&lt;${item.branchInfo ? item.branchInfo.name : '( 无 )'}&gt; ${
                  item.branchInfo ? item.branchInfo['SHA1'] : '( 无 )'
                }`
              }}
              <i
                class="home-collapse__icons el-icon-document-copy"
                @click="
                  copyDocument(item.branchInfo ? item.branchInfo['SHA1'] : '')
                "
              ></i>
            </p>
            <p class="home-collapse__details">
              远程地址:
              {{ item.remoteUrl || '( 无 )' }}
              <i
                class="home-collapse__icons el-icon-document-copy"
                @click="copyDocument(item.remoteUrl || '')"
              ></i>
            </p>
          </div>
          <div class="home-collapse__right">
            <i
              class="home-collapse__controls home-collapse__icons el-icon-video-play"
              @click="preExecute(item.id)"
            ></i>
            <i
              class="home-collapse__controls home-collapse__icons el-icon-setting"
              @click="leadToWorkflowPage(item.id)"
            ></i>
            <i
              class="home-collapse__controls home-collapse__icons home-collapse__icons--danger el-icon-delete"
              @click="deleteData(item.id)"
            ></i>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </section>
</template>

<script>
export default {
  name: 'Datalist'
}
</script>

<style lang="scss" scoped>
.datalist {
}
</style>
