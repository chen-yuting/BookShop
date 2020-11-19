<template>
  <!-- 标题栏 -->
  <transition name="slide-down">
    <div class="title-wrapper" v-show="menuVisible">
      <div class="left">
        <span class="icon-back icon" @click="back()"></span>
      </div>
      <div class="right">
        <div class="icon-wrapper">
          <span class="icon-shelf icon" @click="showBookShelf()"></span>
          <span class="icon-cart icon"></span>
          <span class="icon-more icon"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
export default {
  mixins: [ebookMixin],
  methods: {
    back() {
      this.$router.go(-1);
    },
    showBookShelf() {
      this.$router.push("/store/shelf");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.title-wrapper {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 201;
  width: 100%;
  height: px2rem(48);
  font-size: px2rem(25);
  box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, 0.15);
  background-color: white;
  .left {
    flex: 0 0 px2rem(60);
    @include left;
    .icon {
      padding: px2rem(7);
    }
  }
  .right {
    flex: 1;
    @include right;
    .icon {
      padding: px2rem(7);
    }
  }
}
</style>