<template>
  <div id="app">
    <v-header :seller='seller'></v-header>
    <div class="tab">
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
  const SUCCESS = 0;
  export default {
    data() {
      return {
        seller: {}
      };
    },
    created() {
      this.$http.get('/api/seller').then((response) => {
          response=response.body;
          if(response.status==SUCCESS){
              this.seller=response.seller;
          }
      })
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/index.styl';
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    text-align: center
    .tab-item
      flex: 1
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        border-1px(rgb(77, 85, 93))
        &.active
          color: rgb(240, 20, 20)
          border-1px(rgb(240, 20, 20))
</style>
