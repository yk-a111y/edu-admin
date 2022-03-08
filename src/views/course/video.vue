<template>
  <div class="course-video">
    <el-card class="box-card">
      <div slot="header">课程相关信息</div>
      <el-form>
        <el-form-item label="视频上传">
          <input type="file">
        </el-form-item>
        <el-form-item label="封面上传">
          <input type="file">
        </el-form-item>
        <el-form-item>
          <el-button type="primary">开始上传</el-button>
          <el-button @click="$router.push({
            name: 'course-section',
            params: {
              courseId
            }
          })">返回</el-button>
        </el-form-item>
        <el-form-item>
          <p v-if="uploadPercent !== 0">视频上传中：{{uploadPercent}}</p>
          <p v-if="isUploadSuccess">视频转码中：{{isTranscodeSuccess ? '完成':'正在转码中...'}}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  aliyunImageUploadAddressAndAuth,
  aliyunVideoUploadAddressAndAuth,
  aliyunVideoTranscode,
  getAliyunTranscodePercent
} from '@/services/aliyun-upload'

export default {
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      imageUrl: '',
      // 上传实例
      uploader: null,
      // 视频ID
      videoId: null,
      // 上传百分比
      uploadPercent: 0,
      // 上传完毕状态
      isUploadSuccess: false,
      // 转码状态
      isTranscodeSuccess: false
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    handleUpload () {
      // 点击上传时，数据重置
      this.uploadPercent = 0
      this.isUploadSuccess = false
      this.isTranscodeSuccess = false
      // 获取上传的文件
      const videoFile = this.$refs['video-file'].files[0]
      const imageFile = this.$refs['image-file'].files[0]
      // 文件添加到上传列表
      const uploader = this.uploader
      // 按照文档示例要求添加文件
      uploader.addFile(imageFile)
      uploader.addFile(videoFile)
      // 开始上传
      uploader.startUpload()
    },
    initUploader () {
      // 官方示例
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里云账号，必须有值
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async uploadInfo => {
          let uploadAddressAndAuth = null
          // 检测文件是图片或视频
          if (uploadInfo.isImage) {
            // 图片处理
            const { data } = await aliyunImageUploadAddressAndAuth()
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              this.imageURL = uploadAddressAndAuth.imageURL
            }
          } else {
            // 视频处理
            const { data } = await aliyunVideoUploadAddressAndAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              this.videoId = data.data.videoId
            }
          }
          // 设置凭证与地址
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
        },
        // 文件上传失败
        onUploadFaile: function (uploadInfo, code, message) {
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo) {
        },
        // 全部文件上传结束
        onUploadEnd: async uploadInfo => {
          this.isUploadSuccess = true
          const lessonId = this.$route.query.lessonId
          // 发送视频转码请求
          const { data } = await aliyunVideoTranscode({
            lessonId,
            coverImageUrl: this.imageURL,
            fileName: this.$refs['video-file'].files[0].name,
            fileId: this.videoId
          })
          console.log(data)
          if (data.code === '000000') {
            const timer = setInterval(async () => {
              const { data } = await getAliyunTranscodePercent(lessonId)
              if (data.code === '000000') {
                this.isTranscodeSuccess = true
                if (data.dara === 100) {
                  this.$message.success('视频转码成功')
                  // 清除定时器
                  clearInterval(timer)
                }
              }
            }, 1000)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
