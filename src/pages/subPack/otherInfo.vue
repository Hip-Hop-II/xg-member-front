<template>
  <view class="enterpriseInfo padding20">
    <view class="fontSize18 marginTop20 marginBottom20">上传合作协议</view>
    <uni-file-picker v-model="merchantForm.agreementPhotoUrl" limit="1" :imageStyles="imageStyles"
      :sizeType="['original', 'compressed']" @select="selectFile($event, 'agreementPhotoUrl')"
      @delete="deleteFile($event, 'agreementPhotoUrl')" />
    <view class="flex spaceBetween fixedBottom" style="margin-left: -20px">
      <view class="btn-primary-left" @click="goBack">上一步</view>
      <view class="btn-primary-right" @click="commit">进入实名认证</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { uploadToOss } from '../../utils/upload'
import { enterpriseCommitApi, getMemberInfoApi, saveFileApi } from '../../api/index'

const imageStyles = {
  width: 170,
  height: 100,
}

const getMerchantDetails = async () => {
  const res = await getMemberInfoApi({});
  if (res.data.merchantFiles?.length > 0) {
    res.data.merchantFiles.map(item => {
      merchantForm[item.fileType] = [{ url: item.filePath, id: item.id, name: item.fileType, extname: 'png' }]
    });
  }
  merchantForm.lawPersonName = res.data.lawPersonName
}
getMerchantDetails()

const merchantForm = reactive({
  agreementPhotoUrl: [],
  industryQualificationUrl: [],
  lawPersonName: "",
})
const selectFile = (e, bizType) => {
  uploadToOss({
    file: e.tempFiles[0],
    bizType: bizType
  }).then(res => {
    saveFileApi({
      merchantNum: uni.getStorageSync('userInfo').merchantNum,
      fileType: bizType,
      filePath: res.url
    }).then(res => {
      merchantForm[bizType] = [{ id: res.data.fileId }]
      uni.showToast({
        title: res.msg,
        icon: 'none'
      })
    });
  });
}
const deleteFile = (e, bizType) => {
  const id = merchantForm[bizType][0]?.id;
  if (!id) return true;
  delFileApi({
    merchantNum: uni.getStorageSync('userInfo').merchantNum,
    fileId: id
  }).then(res => {
    uni.showToast({
      title: res.msg,
      icon: 'none'
    })
  })
  merchantForm[bizType] = []
}
const commit = () => {
  enterpriseCommitApi({
    merchantNum: uni.getStorageSync('userInfo').merchantNum,
    returnUrl: '/pages/my/index'
  }).then(res => {
    const url = res.data?.electronicSignInfo?.url
    if (url) {
      uni.redirectTo({
        url: `/pages/subPack/authenticationInfo?name=${merchantForm.lawPersonName}&url=${encodeURIComponent(url)}`
      })
    } else {
      uni.showToast({
        title: res.data?.electronicSignInfo?.errorMsg,
        icon: 'none'
      })
    }
  });
}
function goBack() {
  uni.navigateTo({
    url: '/pages/subPack/publicAccountInfo'
  })
}

</script>

<style lang="scss">
page {
  background-color: #FFFFFF;
}
</style>
