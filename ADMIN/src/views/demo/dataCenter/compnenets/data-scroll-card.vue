<template>
  <section style="overflow: hidden">
    <ul class="scroll-title">
      <li>昵称</li>
      <li>类型</li>
      <li>页面</li>
      <li>IP</li>
      <li>地址</li>
      <li>平台</li>
      <li>次数</li>
      <li>时间</li>
    </ul>

    <Vue3SeamlessScroll :list="listData" hover :class-option="classOption" class="warp">
      <ul class="item">
        <li v-for="(item, index) in listData" :key="index">
          <span class="title">{{ item.name }}</span>
          <span class="date">{{ item.type }}</span>
          <span class="date">{{ item.page }}</span>
          <span class="date">{{ item.ip }}</span>
          <span class="date">{{ item.address }}</span>
          <span class="date">{{ item.browser }}</span>
          <span class="date">{{ item.viewNum }}</span>
          <span class="date">{{ item.createdAt }}</span>
        </li>
      </ul>
    </Vue3SeamlessScroll>
  </section>
</template>

<script>
import {Vue3SeamlessScroll} from "vue3-seamless-scroll";

export default {
  name: "data-scroll-card",
  components: {
    Vue3SeamlessScroll
  },
  data() {
    return {
      classOption: {
        direction: 0,
      },
      listData: [
        {
          "_id": "650a4d187d5c9826f63aa9a1",
          "name": "ZY·Admin",
          "type": "admin",
          "page": "管理端",
          "ip": "111.121.47.42",
          "address": "贵州省贵阳市 电信",
          "browser": "Chrome.v116",
          "viewNum": 1,
          "createdAt": "2023-09-20T01:38:32.966Z",
          "updatedAt": "2023-09-20T01:38:32.966Z"
        },
        {
          "_id": "650a4af57d5c9826f63aa922",
          "name": "披着羊皮的狼",
          "type": "admin",
          "page": "管理端",
          "ip": "111.121.47.42",
          "address": "贵州省贵阳市 电信",
          "browser": "Chrome.v116",
          "viewNum": 3,
          "createdAt": "2023-09-20T01:29:25.683Z",
          "updatedAt": "2023-09-20T01:38:22.938Z"
        },
        {
          "_id": "650a4af27d5c9826f63aa91a",
          "name": "游客",
          "type": "admin",
          "page": "管理端/登录",
          "ip": "111.121.47.42",
          "address": "贵州省贵阳市 电信",
          "browser": "Chrome.v116",
          "viewNum": 2,
          "createdAt": "2023-09-20T01:29:22.041Z",
          "updatedAt": "2023-09-20T01:38:25.653Z"
        },
        {
          "_id": "650a4a177d5c9826f63aa884",
          "name": "披着羊皮的狼",
          "type": "admin",
          "page": "管理端",
          "ip": "163.123.192.45",
          "address": "加拿大",
          "browser": "Chrome.v117",
          "viewNum": 1,
          "createdAt": "2023-09-20T01:25:43.645Z",
          "updatedAt": "2023-09-20T01:25:43.645Z"
        },
        {
          "_id": "650a4a097d5c9826f63aa870",
          "name": "游客",
          "type": "admin",
          "page": "管理端/登录",
          "ip": "163.123.192.45",
          "address": "加拿大",
          "browser": "Chrome.v117",
          "viewNum": 1,
          "createdAt": "2023-09-20T01:25:29.118Z",
          "updatedAt": "2023-09-20T01:25:29.118Z"
        },
        {
          "_id": "650a49ad7d5c9826f63aa837",
          "name": "游客",
          "type": "client",
          "page": "前台/主页",
          "ip": "220.196.160.76",
          "address": "江苏省常州市 联通",
          "browser": "Mobile Safari.v13",
          "viewNum": 1,
          "createdAt": "2023-09-20T01:23:57.797Z",
          "updatedAt": "2023-09-20T01:23:57.797Z"
        },
        {
          "_id": "650a49937d5c9826f63aa81c",
          "name": "游客",
          "type": "client",
          "page": "前台/主页",
          "ip": "180.101.245.253",
          "address": "江苏省南京市 电信",
          "browser": "Mobile Safari.v13",
          "viewNum": 1,
          "createdAt": "2023-09-20T01:23:31.066Z",
          "updatedAt": "2023-09-20T01:23:31.066Z"
        },
        {
          "_id": "650a49907d5c9826f63aa814",
          "name": "游客",
          "type": "client",
          "page": "前台/留言板",
          "ip": "111.121.47.42",
          "address": "贵州省贵阳市 电信",
          "browser": "Chrome.v116",
          "viewNum": 2,
          "createdAt": "2023-09-20T01:23:28.460Z",
          "updatedAt": "2023-09-20T01:26:57.085Z"
        },
        {
          "_id": "650a49387d5c9826f63aa7fd",
          "name": "游客",
          "type": "client",
          "page": "前台/博客列表",
          "ip": "111.121.47.42",
          "address": "贵州省贵阳市 电信",
          "browser": "Chrome.v116",
          "viewNum": 12,
          "createdAt": "2023-09-20T01:22:00.682Z",
          "updatedAt": "2023-09-20T01:59:50.572Z"
        },
        {
          "_id": "650a48df7d5c9826f63aa7c7",
          "name": "游客",
          "type": "client",
          "page": "前台/主页",
          "ip": "111.121.47.42",
          "address": "贵州省贵阳市 电信",
          "browser": "Chrome.v116",
          "viewNum": 18,
          "createdAt": "2023-09-20T01:20:31.769Z",
          "updatedAt": "2023-09-20T02:00:37.819Z"
        },
        {
          "_id": "650a047f7d5c9826f63aa6ea",
          "name": "游客",
          "type": "client",
          "page": "前台/主页",
          "ip": "220.196.160.65",
          "address": "江苏省常州市 联通",
          "browser": "Mobile Safari.v13",
          "viewNum": 1,
          "createdAt": "2023-09-19T20:28:47.324Z",
          "updatedAt": "2023-09-19T20:28:47.324Z"
        },
        {
          "_id": "6509f5e17d5c9826f63aa6dc",
          "name": "游客",
          "type": "client",
          "page": "前台/主页",
          "ip": "49.234.35.33",
          "address": "上海市上海市 腾讯云",
          "browser": "Chrome.v101",
          "viewNum": 1,
          "createdAt": "2023-09-19T19:26:25.157Z",
          "updatedAt": "2023-09-19T19:26:25.157Z"
        },
        {
          "_id": "6509bef27d5c9826f63aa4ae",
          "name": "游客",
          "type": "admin",
          "page": "管理端/登录",
          "ip": "49.65.191.0",
          "address": "江苏省南京市 电信",
          "browser": "Edge.v17",
          "viewNum": 1,
          "createdAt": "2023-09-19T15:32:02.479Z",
          "updatedAt": "2023-09-19T15:32:02.479Z"
        },
        {
          "_id": "6509b360a0d58a3cda8d2e20",
          "name": "游客",
          "type": "client",
          "page": "前台/主页",
          "ip": "114.218.86.153",
          "address": "江苏省苏州市 电信",
          "browser": "Edge.v117",
          "viewNum": 2,
          "createdAt": "2023-09-19T14:42:40.744Z",
          "updatedAt": "2023-09-19T14:52:16.064Z"
        },
        {
          "_id": "6509ac56a0d58a3cda8d2dec",
          "name": "小可爱",
          "type": "admin",
          "page": "管理端",
          "ip": "61.190.198.10",
          "address": "安徽省芜湖市 电信",
          "browser": "Edge.v117",
          "viewNum": 2,
          "createdAt": "2023-09-19T14:12:38.500Z",
          "updatedAt": "2023-09-19T14:13:37.881Z"
        },
        {
          "_id": "6509ac4ba0d58a3cda8d2de2",
          "name": "游客",
          "type": "admin",
          "page": "管理端/登录",
          "ip": "61.190.198.10",
          "address": "安徽省芜湖市 电信",
          "browser": "Edge.v117",
          "viewNum": 2,
          "createdAt": "2023-09-19T14:12:27.223Z",
          "updatedAt": "2023-09-19T14:14:06.046Z"
        },
        {
          "_id": "6509ac2ca0d58a3cda8d2ddf",
          "name": "游客",
          "type": "client",
          "page": "前台/主页",
          "ip": "61.190.198.10",
          "address": "安徽省芜湖市 电信",
          "browser": "Edge.v117",
          "viewNum": 1,
          "createdAt": "2023-09-19T14:11:56.028Z",
          "updatedAt": "2023-09-19T14:11:56.028Z"
        },
        {
          "_id": "6509aa57a0d58a3cda8d2dd5",
          "name": "游客",
          "type": "client",
          "page": "前台/主页",
          "ip": "171.34.208.115",
          "address": "江西省南昌市 联通",
          "browser": "Firefox.v117",
          "viewNum": 1,
          "createdAt": "2023-09-19T14:04:07.905Z",
          "updatedAt": "2023-09-19T14:04:07.905Z"
        },
        {
          "_id": "65098997a0d58a3cda8d2dc2",
          "name": "游客",
          "type": "client",
          "page": "前台/博客列表",
          "ip": "113.87.46.176",
          "address": "广东省深圳市 电信",
          "browser": "Chrome.v116",
          "viewNum": 1,
          "createdAt": "2023-09-19T11:44:23.746Z",
          "updatedAt": "2023-09-19T11:44:23.746Z"
        },
        {
          "_id": "65097231a0d58a3cda8d2d97",
          "name": "游客",
          "type": "client",
          "page": "前台/博客列表",
          "ip": "223.104.122.163",
          "address": "中国 移动",
          "browser": "Chrome.v116",
          "viewNum": 2,
          "createdAt": "2023-09-19T10:04:33.577Z",
          "updatedAt": "2023-09-19T10:04:56.581Z"
        }
      ],
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #4c71ea;
$secondary-color: #00d8ff;
$background-color: #686868;
$border-color: #686868;
$font-color: #b4b3b3;

$scroll-title-height: 2rem;
$scroll-title-font-size: 1rem;
$scroll-title-text-shadow: 0 0 25px $secondary-color;

$warp-height: calc(100% - #{$scroll-title-height});
$warp-font-size: .9rem;
$warp-border-color: #686868;
$warp-margin-bottom: 5px;

.scroll-title {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 0 25px $primary-color inset;

  li {
    width: 25%;
    height: $scroll-title-height;
    line-height: $scroll-title-height;
    font-size: $scroll-title-font-size;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #EEEEEE;
    font-weight: bold;
    font-family: "Adobe 楷体 Std R";
    text-shadow: $scroll-title-text-shadow;
  }
}

.warp {
  height: $warp-height;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  color: $background-color;

  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;

    li {
      height: 2.14rem;
      line-height: 2.14rem;
      display: flex;
      text-align: center;
      justify-content: space-between;
      font-size: $warp-font-size;
      border-bottom: 1px solid $warp-border-color;
      margin-bottom: $warp-margin-bottom;

      span {
        display: inline-block;
        width: 25%;
        color: $font-color;
      }
    }
  }
}

</style>
