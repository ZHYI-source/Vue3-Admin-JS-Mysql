<template>
  <section class="zy-tabs" id="zy-tab">
    <a-tabs size="small" hide-add v-model:activeKey="currentTab" @tabClick="handleTabClick" @edit="onEdit"
            type="editable-card">
      <a-tab-pane v-for="pane in list" :key="pane.path" :tab="pane.meta.title" :closable="pane.path!=='/index'"/>
    </a-tabs>
    <a-tooltip placement="topLeft">
      <template #title>
        <span>关闭全部</span>
      </template>
      <IconFont class="close-tab close-tab-all" @click="handleTabCleanDirection('all')" type="icon-guanbi"/>
    </a-tooltip>
    <a-dropdown class="close-tab" placement="bottom">
      <IconFont class="close-tab-other-icon" @click="handleTabClean" type="icon-left"/>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="handleTabCleanDirection('left')">
            关闭左侧
          </a-menu-item>
          <a-menu-item @click="handleTabCleanDirection('right')">
            关闭右侧
          </a-menu-item>
          <a-menu-item @click="handleTabCleanDirection('other')">
            关闭其他
          </a-menu-item>
          <a-menu-item @click="handleTabCleanDirection('all')">
            关闭全部
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </section>
</template>
<script setup>
import {computed, ref, watch} from 'vue';
import {useTabsStore} from '@/stores/tabs.js';
import {useRouter} from 'vue-router';

const router = useRouter();
let tabsStore = useTabsStore()
// 计算属性，用于监听菜单的变化
const tabsList = ref(tabsStore.tabsList);
const current = ref(tabsStore.current);
const list = computed({
  get: () => tabsStore.tabsList,
  set: (value) => {
    tabsList.value = value;
  },
});

const currentTab = computed({
  get: () => tabsStore.current,
  set: (value) => {
    current.value = value;
  },
});

// 导航到指定路由
const navigateTo = (key) => {
  router.push(key);
};

const handleTabClick = (opt) => {
  navigateTo(opt)
  // 设置激活tabs和侧边栏的激活菜单
  tabsStore.currentSet(opt)
};
const handleTabCleanDirection = (direction) => {
  tabsStore.removeRightOrLeftTabs(direction)
}

// 清除
const handleTabClean = () => {
  tabsStore.removeAllTabs()
}

const onEdit = targetKey => {
  tabsStore.removeTabs(targetKey)
};


</script>
<style lang="scss">
.zy-tabs {
  width: 100%;
  display: flex;

  .ant-tabs {
    width: 100%;
    padding-right: 18px;
    border: none;

    .ant-tabs-tab {

      font-size: .9rem;
      font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, Arial, sans-serif;

      &:first-child {
        //border-left: none;
        border-top-left-radius: 5px;
        overflow: hidden;
      }
    }

    .ant-tabs-tab-active {


    }
  }

  .ant-tabs > .ant-tabs-nav {
    margin-bottom: 0;
  }

  .close-tab {
    background: #ffffff;
    border: 1px solid #f0f0f0;
    padding: 8px 16px;
    margin-right: 15px;

  }

  .close-tab-other-icon svg {
    transform: rotate(-90deg);
  }

  .close-tab-all {
    margin-right: 0;
    padding: 8px 16px;
    background: #fafafa;
    border: 1px solid #f0f0f0;
  }
}

</style>
