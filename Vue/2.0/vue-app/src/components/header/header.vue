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
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img width="100%" height="100%" :src="seller.avatar" />
    </div>
    <transition name="fade">
    <div v-show="detailShow" class="detail" @click="hideDetail">
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="48" :score="seller.score"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li v-for="(item,index) in seller.supports" class="support-item">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close">
        <i class="icon-close"></i>
      </div>
    </div>
    </transition>
  </div>
</template>

<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/index.styl";
  .header
    color: rgb(255, 255, 255)
    position :relative
    background :rgba(7,17,27,0.5)
    overflow :hidden
    .content-wrapper
      padding:24px 12px 18px 24px
      position:relative
      font-size:0
      .avatar
        display:inline-block
        vertical-align :top
        img
          border-radius :4px
      .content
        display: inline-block
        font-size:0
        margin-left :16px
        .title
          margin :2px 0 8px
          .brand
            display: inline-block
            vertical-align :top
            width :30px
            height:18px
            bg-image:('brand')
            background-size:30px 18px
            background-repeat:no-repeat
          .name
            font-size:14px
            margin-left :6px
            line-height 18px
            font-weight :bold
        .description
          font-size:12px
          line-height: 12px
          margin-bottom:10px
        .supports
          font-size: 0
          font-weight :200
          .icon
            display: inline-block
            width:12px
            height:12px
            background-size:12px 12px
            background-repeat :no-repeat
            margin-right :4px;
            vertical-align:top
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            font-size:10px
            line-height :12px

      .support-count
        position:absolute
        right: 12px
        bottom: 18px
        padding:0 8px
        height: 24px
        line-height :24px
        border-radius :14px
        background :rgba(0,0,0,0.2)
        text-align :center
        .count
          font-size: 10px
        .icon-keyboard_arrow_right
          font-size:10px
    .bulletin-wrapper
      background :rgba(7,17,27,0.2)
      height: 28px
      position:relative
      line-height :28px
      padding :0px 22px 0 12px
      white-space :nowrap
      overflow :hidden
      text-overflow:ellipsis
      font-size :10px
      .bulletin-title
        width: 22px
        height: 12px
        vertical-align :top
        margin-top:8px
        display :inline-block
        bg-image('bulletin')
        background-size :22px 12px
        background-repeat :no-repeat
      .bulletin-text
        margin:0 4px
        vertical-align :top
      .icon-keyboard_arrow_right
        position :absolute
        top:7px
        right:12px
    .background
      width:100%
      height :100%
      top: 0
      left: 0
      z-index :-1
      filter:blur(10px)
      position :absolute
    .detail
      width :100%
      height :100%
      overflow :auto
      z-index: 100
      left: 0
      top:0
      position :fixed
      .detail-wrapper
        min-height :100%
        width :100%
        .detail-main
          padding-bottom:64px
          margin-top:64px
          .name
            font-size :16px
            font-weight :700
            text-align :center
            line-height:16px
          .star-wrapper
            text-align :center
            margin-top: 18px
            padding:2px 0
          .title
            width: 80%
            margin:28px auto 24px
            display:flex
            .line
              flex: 1
              position :relative
              top: -6px
              border-bottom:1px solid rgba(255,255,255,0.2)
            .text
              padding:0 12px
              font-size:14px
              font-weight:700
          .supports
            width:80%
            margin:0 auto
            .support-item
              padding:0 12px
              margin-bottom:12px
              font-size: 0
              &.last-child
                margin-bottom:0
              .icon
                display :inline-block
                width: 16px
                height:16px
                vertical-align :top
                margin-right:6px
                background-size:16px 16px
                background-repeat:no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
              .text
                line-height:16px
                font-size:12px
          .bulletin
            width: 80%
            margin:0 auto
            .content
              padding:0 12px
              line-height :24px
              font-size:12px
      .detail-close
        width: 32px
        height :32px
        margin:-64px auto 0
        clear: both
        font-size :32px
        position :relative
  .fade-enter-active,.fade-leave-active
    transition:  1s all ease
  .fade-enter-to,.fade-leao
    opacity: 0
    background :rgba(7,17,27,0)
  .fade-enter-active
    opacity: 1
    background :rgba(7,17,27,0.8)
  .fade-leave-active
    opacity: 0
    background :rgba(7,17,27,0)
</style>

<script type="es6">
  import star from 'components/star/star';
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow:false
      }
    },
    methods:{
      showDetail(){
        this.detailShow=true;
      },
      hideDetail(){
        this.detailShow=false;
      }
    },
    created() {
      this.classMap=['decrease','discount','special','invoice','guarantee']
    },
    components:{
      star
    }
  };
</script>

