<template>
  <div id="app">
    <v-header></v-header>
    <div class="tab borderBottom">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="es6">
  import header from './components/header/header';
  export default {
    data() {
      return {
        seller: {}
      };
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl';
  @import './common/stylus/base.styl';
  @import './common/stylus/icon.styl';
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    text-align: center
    borderBottom(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
