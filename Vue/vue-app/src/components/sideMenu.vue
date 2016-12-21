<template>
<div class="col-sm-3">
 <ul class="list-group" v-if="menu.list.length">
      <li @click="setActiveItem(item)" v-for="item in menu.list" class="list-group-item" :class="{itemActive:item==menu.active}">
      <router-link :to="/item">{{item}}</router-link>
      </li>
 </ul>
</div>
</template>

<script>
export default {
      props:['menu'],
      methods:{
        setActiveItem:function(activeName){
          this.$parent.sideMenu.active=activeName;
          console.log(activeName)
          this.$http.get('./src/data/page.json')
              .then(function (res) {
              	this.sideMenu=res.body;
              },function (res) {

              })
              .catch(function (response) {

              })
        }
      }
}
</script>


