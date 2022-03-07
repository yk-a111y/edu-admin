<template>
  <div class="course-section">
    <el-tree
      :data="sections"
      :props="defaultProps"
      :allow-drop="handleAllowDrop"
      draggable
    >
      <div class="inner" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span v-if="data.sectionName" class="actions">
          <el-button>编辑</el-button>
          <el-button>添加课时</el-button>
          <el-button>状态</el-button>
        </span>
        <span v-else class="actions">
          <el-button>编辑</el-button>
          <el-button>上传视频</el-button>
          <el-button>状态</el-button>
        </span>
      </div>
    </el-tree>
  </div>
</template>

<script>
import { getSectionAndLesson } from '@/services/course-section'

export default {
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          return data.sectionName || data.theme
        }
      }
    }
  },
  created () {
    this.loadSection()
  },
  methods: {
    handleAllowDrop (draggingNode, dropNode, type) {
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    async loadSection () {
      const { data } = await getSectionAndLesson(this.courseId)
      if (data.code === '000000') {
        this.sections = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inner {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}
::v-deep .el-tree-node__content {
  height: auto;
}
</style>
