<template>
<div>
 	<div class="col-sm-3">
	 <ul class="list-group" v-if="menu.list.length">
	      <li @click="setActiveItem(item)" v-for="item in menu.list" class="list-group-item" :class="{itemActive:item==menu.active}">{{item}}</li>
	 </ul>
</div>
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

