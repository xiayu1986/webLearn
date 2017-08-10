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

<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/mixin.styl";
  .header
    color: rgb(255, 255, 255)
    background:rgb(0,0,0)
    .content-wrapper
      padding:24px 12px 18px 24px
      font-size:0
      .avatar
        display:inline-block
        vertical-align :top
        img
          border-radius :4px
      .content
        display: inline-block
        font-size:14px
        margin-left :16px
        .title
          font-size:0
          line-height 18px
          font-weight :bold
          margin :2px 0 8px
          .brand
            display: inline-block
            vertical-align :top
            width :30px
            height:18px
            bg-image:('brand')
            background-size:30px 18px
            background-repeat:no-repeat
            margin-right :12px
          .name
            font-size:16px
        .description
          font-size:12px
          line-height: 12px
          font-weight :200
          margin:6px 0 8px
        .supports
          font-size: 0
          font-weight :200
          .icon
            display: inline-block
            width:12px
            height:12px
            background-image :url('decrease_1@2x.png')
            background-size:12px 12px
            background-repeat :no-repeat
            margin-right :8px;
            vertical-align:top
          .text
            font-size:10px
            line-height :12px
            display:inline-block

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

