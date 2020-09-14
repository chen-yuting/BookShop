<template>
  <!-- 搜索框组件 -->
  <div>
    <div class="search-bar" :class="{'hide-title':!titleVisible,'hide-shadow':!shadowVisible}">
      <transition name="title-move">
        <!-- 标题 -->
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlapCard()">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper" :class="{'hide-title':!titleVisible}" @click="back()">
        <span class="icon-back icon"></span>
      </div>
      <!-- 搜索框 -->
      <div class="search-bar-input-wrapper" :class="{'hide-title':!titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title':!titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input
            class="input"
            type="text"
            :placeholder="$t('home.hint')"
            v-model="searchText"
            @click="showHotSearch()"
          />
        </div>
      </div>
    </div>
    <hot-search-list v-show="hotSearchVisible" ref="hotSearchList"></hot-search-list>
  </div>
</template>

<script>
import { storeHomeMixin } from "../../utils/mixin";
import HotSearchList from "./HotSearchList";
export default {
  mixins: [storeHomeMixin],
  components: {
    HotSearchList,
  },
  data() {
    return {
      searchText: "",
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false,
    };
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.hideTitle();
        this.showShadow();
      } else {
        this.showTitle();
        this.hideShadow();
      }
    },
    hotSearchOffsetY(hotSearchOffsetY) {
      if (hotSearchOffsetY > 0) {
        this.showShadow();
      } else {
        this.hideShadow();
      }
    },
  },
  methods: {
    showFlapCard() {
      this.setFlapCardVisible(true);
    },
    hideTitle() {
      this.titleVisible = false;
    },
    showTitle() {
      this.titleVisible = true;
    },
    hideShadow() {
      this.shadowVisible = false;
    },
    showShadow() {
      this.shadowVisible = true;
    },
    hideHotSearch() {
      this.hotSearchVisible = false;
    },
    showHotSearch() {
      this.hideShadow();
      this.hideTitle();
      this.hotSearchVisible = true;
      this.$nextTick(() => {
        this.$refs.hotSearchList.reset();
      });
    },
    back() {
      if (this.offsetY > 0) {
        this.hideTitle();
        this.showShadow();
      } else {
        this.showTitle();
        this.hideShadow();
      }
      this.hideHotSearch();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.search-bar {
  position: relative;
  width: 100%;
  height: px2rem(94);
  z-index: 150;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  &.hide-title {
    height: px2rem(52);
  }
  &.hide-shadow {
    box-shadow: none;
  }
  .search-bar-title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    .title-text-wrapper {
      width: 100%;
      @include center;
      height: px2rem(42);
    }
    .title-icon-shake-wrapper {
      position: absolute;
      top: 0;
      right: px2rem(15);
      height: px2rem(42);
      @include center;
    }
  }
  .title-icon-back-wrapper {
    position: absolute;
    top: 0;
    left: px2rem(15);
    z-index: 200;
    height: px2rem(42);
    @include center;
    transition: height $animationTime $animationType;
    &.hide-title {
      height: px2rem(52);
    }
  }
  .search-bar-input-wrapper {
    position: absolute;
    left: 0;
    top: px2rem(42);
    display: flex;
    width: 100%;
    height: px2rem(52);
    padding: px2rem(10);
    box-sizing: border-box;
    transition: top $animationTime $animationType;
    &.hide-title {
      top: 0;
    }
    .search-bar-blank {
      flex: 0 0 0;
      width: 0;
      transition: all $animationTime $animationType;
      &.hide-title {
        flex: 0 0 px2rem(31);
        width: px2rem(31);
      }
    }
    .search-bar-input {
      flex: 1;
      width: 100%;
      background: #f4f4f4;
      border-radius: px2rem(20);
      padding: px2rem(5) px2rem(15);
      box-sizing: border-box;
      border: px2rem(1) solid #eee;
      @include left;
      .icon-search {
      }
      .input {
        width: 100%;
        height: px2rem(22);
        border: none;
        margin-left: px2rem(10);
        font-size: px2rem(12);
        color: #666;
        background: transparent;
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
    }
  }
}
</style>