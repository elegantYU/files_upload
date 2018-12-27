<template>
  <div id="app">
    <Home/>
  </div>
</template>

<script>
import Home from './views/Home.vue'

export default {
  name: 'app',
  components: {
    Home
  }
}
</script>

<style>
body,html{
  margin: 0;
  padding: 0;
  height: 100%;
}
::-webkit-scrollbar{
  width: 4px;
  height: auto;
}
::-webkit-scrollbar-thumb{
  border-radius: 5px;
  background: rgba(0,0,0, .6);
}
::-webkit-scrollbar-track{
  background: rgba(0,0,0, .5);
  border-radius: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100%;
  background-color: #eee;
}
.el-upload-dragger {
  width: 300px !important;
  height: 170px !important;
}
</style>
