<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  .float-right {
    float: right;
  }
  #app {
    min-width: 1140px;
  }
  * {
    padding: 0;
    margin: 0;
  }
  .clearfix {
    overflow: auto;
    zoom: 1;
  }
</style>
