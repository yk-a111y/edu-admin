<template>
  <div class="text-editor" ref="editor"></div>
</template>

<script>
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'

export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isLoaded: false,
      editor: null
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      // 创建
      const editor = new E(this.$refs.editor)
      // 内容要提交前，传出给父组件
      editor.config.onchange = value => {
        this.$emit('input', value)
      }
      // 配置自定义图片上传功能
      editor.config.customUploadImg = async (resultFields, insertImgFn) => {
        const fd = new FormData()
        fd.append('file', resultFields[0])
        const { data } = await uploadCourseImage(fd)
        if (data.code === '000000') {
          insertImgFn(data.data.name)
        }
      }
      // 初始化
      editor.create()
      // 初始化后设置
      editor.txt.html(this.value)
      this.editor = editor
    }
  },
  watch: {
    value () {
      if (!this.isLoaded) {
        this.editor.txt.html(this.value)
        this.isLoaded = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
