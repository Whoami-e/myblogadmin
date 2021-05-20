<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="实时日志" name="first">
        <div class="max">
          <div class="message" v-for="(text,index) in message" :key="index">
            <p v-html="text"></p>
          </div>
        </div>
        <el-button size="small" type="primary" @click="refresh">刷新</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import * as api from '@/api/api';
export default {
  data(){
    return{
      activeName: 'first',
      socket: "",
      message: [],
      id: 1
    }
  },
  methods:{
    refresh(){
      location.reload()
    },
    init: function () {
      if(typeof(WebSocket) === "undefined"){
        alert("您的浏览器不支持socket")
      }else{
        // 实例化socket
        this.socket = new WebSocket(api.websocket)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open: function () {
      console.log("socket连接成功")
    },
    error: function () {
      console.log("连接错误")
    },
    getMessage: function (msg) {
      this.message.push(this.id+" ->"+msg.data)
      this.id = this.id + 1;
    },
    close: function () {
      console.log("socket已经关闭")
    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style>
.message{
  padding-left: 20px;
  padding-bottom: 10px;
  padding-top: 10px;
  background: #FFFFFF;
  width: 100%;
  border-bottom: 1px solid #999999;
}
.max{
  margin-bottom: 10px;
  border-radius: 4px;
  max-height: 530px;
  overflow: auto;
}
</style>