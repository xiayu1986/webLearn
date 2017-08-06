<template>
  <div id="app">
    <v-header></v-header>
    <div class="tab">
      <div class="tab-item"><router-link to="{path:'/goods'}">商品</router-link></div>
      <div class="tab-item"><router-link to="{path:'/ratings'}">评论</router-link></div>
      <div class="tab-item"><router-link to="{path:'/seller'}">商家</router-link></div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import header from './components/header/header';
  export default {
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    text-align: center
    .tab-item
      flex: 1
</style>
