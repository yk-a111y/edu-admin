<template>
  <div class="alloc-menu">
    <span>分配菜单</span>
  </div>
</template>

<script>
export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
