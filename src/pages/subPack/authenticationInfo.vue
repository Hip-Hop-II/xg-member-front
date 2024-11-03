<template>
  <view class="authenticationInfo padding20">
    <view class="text-align-center fontSize20 marginTop20 marginBottom20">转发给“{{ bankAccountName }}”完成实名认证</view>
    <view class="text_bg marginTop20 marginBottom20 fadada_url">{{ fadada_url }}</view>
    <view class="btn-primary-right" @click="copyContent">复制链接</view>
    <image mode="widthFix" src="/static/images/portrait.png" style="width: 24px;margin: 0 calc(50% - 12px);" />
    <view class="text-align-center fontSize20">本人直接认证</view>
    <view class="btn-primary-left" @click="goAuth">去认证</view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad } from '@dcloudio/uni-app';

const fadada_url = ref("")
const bankAccountName = ref("")

onLoad((option) => {
  fadada_url.value = option?.url ? decodeURIComponent(option.url) : "-"
  bankAccountName.value = option?.name || "本人"
})

const copyContent = () => {
  uni.setClipboardData({
    data: fadada_url.value,
    success: function () {
      uni.showToast({
        title: '复制成功',
        icon: 'success'
      })
    }
  })
}

const goAuth = () => {
  if (!fadada_url.value) {
    uni.showToast({
      title: '没有生成认证链接',
      icon: 'none'
    })
    return
  }
  wx.navigateTo({
    url: "/pagesFace/pages/webview/webview?url=" + encodeURIComponent(fadada_url.value),
  });
}
</script>

<style lang="scss">
page {
  background-color: #FFFFFF;

  .fadada_url {
    word-break: break-all;
    overflow-wrap: break-word;
  }
}
</style>
