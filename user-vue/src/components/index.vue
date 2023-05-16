<template>
  <div class="index">
    <div>{{ msg }}</div>
    <router-link to="/login">注册</router-link>
  </div>
</template>

<script>
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'index',
    data() {
        return{
          msg:'欢迎来到商城'
        }
      }
  }
</script>

<style scoped>
</style>
