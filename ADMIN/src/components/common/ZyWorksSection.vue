<template>
  <section class="pro-list">
    <div class="pro-item" v-for="(item,index) in dataList">
      <div class="pro-box">
        <div class="pro-title">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"
               class="octicon">
            <path
                d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
          </svg>
          <a :title="item.sourceUrl" :href="item.sourceUrl" target="_blank">{{ item.title || '-' }}</a>
          <span class="type">开源项目</span>
          <span class="type type-me" v-if="item.isMe">当前项目</span>
        </div>
        <div class="pro-body">
          {{ item.abstract || '-' }}
        </div>
        <div class="pro-footer">
          <span class="lang-tip" v-for="t in item.framework.split('、')">{{ t }}</span>
        </div>
        <div class="pro-footer" v-if="item.demoUrl">
          <a :href="item.demoUrl" target="_blank">在线地址</a>
        </div>
      </div>
    </div>
    <div class="pro-item" @click="goToPage('/Portfolio')" v-if="false">
      <div class="pro-box">
        <div class="pro-title">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"
               class="octicon">
            <path
                d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
          </svg>
          <a>查看更多</a>
          <span class="type">开源项目</span>
        </div>
        <div class="pro-body more">
          <i class="iconfont icon-click"></i> MORE
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>

const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  }
})
const goToPage=()=>{

}

</script>

<style lang="scss" scoped>
.pro-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;

  .pro-item {
    width: 50%;
    padding: 8px;
    box-sizing: border-box;

    .pro-box {
      padding: 1rem;
      border: 1px solid #EEEEEE;
      border-radius: .5rem;
      height: 100%;

      .pro-title {
        font-size: 14px;
        font-weight: bold;

        display: flex;
        flex: 1;
        justify-content: flex-start;
        align-items: center;
        color: #656d76;

        .octicon {
          fill: #656d76;
        }

        a {
          display: inline-block;
          margin: 0 8px;
          max-width: 65%;
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; //溢出不换行
        }

        .type {
          display: inline-block;
          font-weight: normal;
          border: 1px solid #EEEEEE;
          border-radius: .8rem;
          height: 25px;
          line-height: 22px;
          box-sizing: border-box;
          padding: 0.12em 0.5em;
          font-size: 12px;

        }
        .type-me {
          background-color: #8ec60b;
          color: #EEEEEE;
          margin-left: 5px;
          border-color: #8ec60b;
        }
      }

      .pro-body {
        font-size: 13px;
        margin: 8px 0;
        min-height: 91px;
        overflow: hidden;
        /*将对象作为弹性伸缩盒子模型显示*/
        display: -webkit-box;
        /*设置子元素排列方式*/
        -webkit-box-orient: vertical;
        /*设置显示的行数，多出的部分会显示为...*/
        -webkit-line-clamp: 5;
      }

      .pro-footer {
        font-size: 13px;
        display: flex;
        flex-wrap: wrap;

        a {
          font-size: 12px;
          padding-left: 12px;
          position: relative;

          &:before {
            content: '';
            width: 8px;
            height: 8px;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            background-color: #c808d5;
            border-radius: 50%;
          }
        }

        .lang-tip {
          position: relative;
          padding-left: 12px;
          margin-right: 8px;
          margin-bottom: 5px;

          &:before {
            content: '';
            width: 8px;
            height: 8px;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            background-color: green;
            border-radius: 50%;
          }
        }
      }

      .more {
        font-size: 1.5rem;
        text-align: center;
        line-height: 91px;
        cursor: pointer;

        .icon-click {
          font-size: 1.5rem;
        }
      }
    }
  }

  @media screen and (max-width: 750px) {
    flex-direction: column;
    .pro-item {
      width: 100%;
    }
  }
}

</style>
