<template>
  <view class="reviewPage padding20">
    <view v-if="success">
      <image style="width: 60px" src="/static/images/success.png" mode="widthFix"/>
      <view>恭喜您成功</view>
      <view class="btn-primary fixedBottom widthCount" @click="goBack">返回</view>
    </view>
    <view v-if="!success">
      <image style="width: 60px" src="/static/images/fail.png" mode="widthFix"/>
      <view v-html="'抱歉您提供的信息有误<br>需重新修改'"/>
      <view class="btn-primary marginTop100">修改信息</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const success = ref(true)

const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss">
page {
  background-color: #FFFFFF;
}
</style>
