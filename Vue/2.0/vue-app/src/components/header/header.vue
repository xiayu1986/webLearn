<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width='64' height='64' :src='seller.avatar'/>
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div class="supports" v-if='seller.supports'>
          <div class="icon"></div>
          <div class="text">{{seller.supports[0].description}}</div>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper">

    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus">
  .header
    color: rgb(255, 255, 255)
    background:rgb(0,0,0)
    .content-wrapper
      padding:24px 12px 18px 24px
      font-size:0
      .avatar
        display:inline-block
      .content
        display: inline-block
        font-size:14px

</style>

<script type="es6">
  export default {
    props: {
      seller: {
        type: Object
      }
    }
  };
</script>
