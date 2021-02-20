<template>
  <div>
    <el-menu
        default-active="0"
        class="el-menu-vertical"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#F56C6C"
        :unique-opened="true">

      <!--遍历菜单内容-->
      <template v-for="(item,index) in menuList">

        <router-link :to="item.path" v-if="!item.children && !item.hidden" :key="index">
          <el-menu-item :index="index.toString()">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </router-link>

        <el-submenu v-if="item.children && !item.hidden" :key="index" :index="index.toString()">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </template>

          <router-link :to="item.path+'/'+subItem.path" v-for="(subItem,subIndex) in item.children" :key="subIndex">
            <el-menu-item :index="index+'-'+subIndex" v-if="!subItem.hidden">
              <i :class="subItem.icon"></i>
              <span slot="title">{{ subItem.name }}</span>
            </el-menu-item>
          </router-link>

        </el-submenu>
      </template>

    </el-menu>
  </div>
</template>
<script>
  import {routes} from '../router'
  export default {
    data() {
      return {
        menuList: []
      }
    },
    mounted() {
      let menuList = routes[0]
      this.menuList = menuList.children
    }
  }
</script>
<style>
  .el-menu-vertical a {
    text-decoration: none;
  }
  .el-menu-vertical {
    border-right: solid 1px #545c64;
  }
</style>