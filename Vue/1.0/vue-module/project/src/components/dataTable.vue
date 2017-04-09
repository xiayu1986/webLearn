<template>
  <table class="table table-bordered table-striped">
    <thead>
    <tr>
      <th v-for="H in headList">{{H}}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="U in userList">
      <td>{{U.name}}</td>
      <td>{{U.userId}}</td>
      <td>{{U.project}}</td>
      <td>{{U.class}}</td>
    </tr>
    </tbody>
  </table>
</template>
<script>
  export default{
    replace:true,
    data:function(){
      return {
      headList:[],
      userList:[],
        remote:"/src/data/user.json"
      }
    },
    methods:{
      getRemoteDate:function(){//加载数据
         var resource=this.$resource(this.remote),_this=this;
         resource.get().then(function(res){
          _this.headList=res.data.header;
          _this.userList=res.data.list;
         })
      }
    },
    mounted:function(){
    this.getRemoteDate();
    }
  }
</script>