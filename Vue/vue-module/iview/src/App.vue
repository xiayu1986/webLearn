<template>
  <div id="app" class="container">
    <div class="panel panel-primary">
      <div class="panel-heading">组件化</div>
      <div class="panel-body">
          <Progress :percent="25"></Progress>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      modal1: false
    }
  },
  methods:{
  }
}
</script>

<style>
</style>
