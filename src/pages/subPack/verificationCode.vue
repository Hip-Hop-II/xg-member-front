<template>
  <view class="verificationCode padding20">
    <view class="fontSize28">请输入验证码</view>
    <view class="marginTop10 color666666 fontSize14">已发送至173****0000</view>
    <view class="input_item">
      <input v-model="code" class="input" type="text"/>
    </view>
    <view class="marginTop20 color666666 fontSize14">重新发送58s</view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const code = ref('')

</script>

<style lang="scss">
page {
  background-color: #FFFFFF;
}
</style>
