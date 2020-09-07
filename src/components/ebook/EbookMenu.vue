<template>
  <div>
    <transition name="slide-up">
      <div class="menu-wrapper" :class="{'hide-box-shadow':!menuVisible || settingVisible>=0}" v-show="menuVisible">
        <div class="icon-wrapper">
          <!-- 目录 -->
          <span class="icon-menu icon" @click="showSetting(3)"></span>
          <!-- 进度 -->
          <span class="icon-progress icon" @click="showSetting(2)"></span>
          <!-- 主题 -->
          <span class="icon-bright icon" @click="showSetting(1)"></span>
          <!-- 字号 -->
          <span class="icon-A icon" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <ebook-setting-theme></ebook-setting-theme>
  </div>
</template>

<script>
import EbookSettingFont from "./EbookSettingFont";
import EbookSettingFontPopup from "./EbookSettingFontPopup";
import EbookSettingTheme from "./EbookSettingTheme";
import { ebookMixin } from "../../utils/mixin";
export default {
  mixins: [ebookMixin],
  components: {
    EbookSettingFont,
    EbookSettingFontPopup,
    EbookSettingTheme
  },
  methods: {
    showSetting(key) {
      this.setSettingVisible(key);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.menu-wrapper {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 101;
  width: 100%;
  height: px2rem(48);
  font-size: px2rem(25);
  background-color: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  &.hide-box-shadow {
    box-shadow: none;
  }
  .icon-wrapper {
    @include center;
    .icon-menu {
      position: absolute;
      left: px2rem(20);
    }
    .icon-progress {
      position: absolute;
      left: 33%;
    }
    .icon-bright {
      position: absolute;
      left: 66%;
    }
    .icon-A {
      position: absolute;
      right: px2rem(20);
      font-size: px2rem(25);
    }
  }
}
</style>