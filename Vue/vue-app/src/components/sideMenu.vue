<template>
<div class="col-sm-3">
 <ul class="list-group" v-if="menu.list.length">
      <li @click="setActiveItem(item)" v-for="item in menu.list" class="list-group-item" :class="{active:item==menu.active}">{{item}}</li>
 </ul>
</div>
</template>

<script>
export default {
      props:['menu'],
      methods:{
        setActiveItem:function(activeName){
          this.$parent.sideMenu.active=activeName;
        }
      }
}
</script>
<style>
.list-group > .list-group-item{background-color: #222222;border-color: #080808; color: #337ab7; cursor:pointer;}
.list-group-item:hover{background-color: #111111;}
</style>

