<template>
  <div>
    <transition name="slide-up">
      <div class="setting-wrapper" v-show="menuVisible && settingVisible==0">
        <!-- 设置字号 -->
        <div class="setting-font-size">
          <div class="preview-min" :style="{fontSize:fontSizeList[0].fontSize+'px'}">A</div>
          <div class="select">
            <div
              class="select-wrapper"
              v-for="(item,index) in fontSizeList"
              :key="index"
              @click="setFontSize(item.fontSize)"
            >
              <div class="line"></div>
              <div class="point-wrapper">
                <div class="point" v-show="defaultFontSize==item.fontSize">
                  <div class="small-point"></div>
                </div>
              </div>
              <div class="line"></div>
            </div>
          </div>
          <div
            class="preview-max"
            :style="{fontSize:fontSizeList[fontSizeList.length-1].fontSize+'px'}"
          >A</div>
        </div>
        <!-- 设置字体 -->
        <div class="setting-font-family" @click="showFontFamilyPopup()">
          <div class="setting-font-family-text-wrapper">
            <span class="setting-font-family-text">{{defaultFontFamily}}</span>
          </div>
          <div class="setting-font-family-icon-wrapper">
            <span class="icon-forward"></span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { FONT_SIZE_LIST } from "../../utils/book";
import { ebookMixin } from "../../utils/mixin";
export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontSizeList: FONT_SIZE_LIST,
    };
  },
  methods: {
    setFontSize(fontSize) {
      this.setDefaultFontSize(fontSize);
      this.currentBook.rendition.themes.fontSize(fontSize + "px");
    },
    showFontFamilyPopup() {
      this.setFontFamilyVisible(true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.setting-wrapper {
  position: absolute;
  bottom: px2rem(48);
  left: 0;
  width: 100%;
  height: px2rem(90);
  z-index: 101;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  .setting-font-size {
    display: flex;
    flex: 2;
    .preview-min {
      position: relative;
      left: 4%;
      flex: 0 0 px2rem(40);
      @include center;
    }
    .preview-max {
      position: relative;
      right: 4%;
      flex: 0 0 px2rem(40);
      @include center;
    }
    .select {
      display: flex;
      flex: 1;
      .select-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        &:first-child {
          .line {
            &:first-child {
              border-top: none;
            }
          }
        }
        &:last-child {
          .line {
            &:last-child {
              border-top: none;
            }
          }
        }
        .line {
          flex: 1;
          height: 0;
          border-top: px2rem(1) solid #ccc;
        }
        .point-wrapper {
          position: relative;
          flex: 0 0 0;
          width: 0;
          height: px2rem(7);
          border-left: px2rem(1) solid #ccc;
          .point {
            @include center;
            position: absolute;
            top: px2rem(-8);
            left: px2rem(-10);
            width: px2rem(20);
            height: px2rem(20);
            border-radius: 50%;
            background: white;
            border: px2rem(1) solid #ccc;
            box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
            .small-point {
              width: px2rem(5);
              height: px2rem(5);
              border-radius: 50%;
              background: black;
            }
          }
        }
      }
    }
  }
  .setting-font-family {
    flex: 1;
    font-size: px2rem(14);
    @include center;
    .setting-font-family-text-wrapper {
      @include center;
    }
    .setting-font-family-icon-wrapper {
      @include center;
    }
  }
}
</style>