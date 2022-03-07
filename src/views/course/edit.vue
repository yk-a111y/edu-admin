<template>
  <div class="course-edit">
    <create-or-edit
      isEdit
      :courseId="courseId"
    ></create-or-edit>
  </div>
</template>

<script>
import CreateOrEdit from './components/CreateOrEdit'

export default {
  name: 'CourseEdit',
  components: {
    CreateOrEdit
  },
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
