<template>
  <div class="user">
    <user-list></user-list>
  </div>
</template>

<script>
import UserList from './components/List.vue'

export default {
  name: 'user',
  components: {
    UserList
  }
}
</script>

<style lang="scss"></style>
