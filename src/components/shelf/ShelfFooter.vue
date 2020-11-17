<template>
  <!-- 书架编辑状态底部的操作栏 -->
  <div class="shelf-footer" v-show="isEditMode">
    <div
      class="shelf-footer-tab-wrapper"
      v-for="item in tabs"
      :key="item.index"
      @click="onTabClick(item)"
    >
      <div class="shelf-footer-tab" :class="{ 'is-selected': isSelected }">
        <div
          class="icon-private tab-icon"
          v-if="item.index == 1 && !isPrivate"
        ></div>
        <div
          class="icon-private-see tab-icon"
          v-if="item.index == 1 && isPrivate"
        ></div>
        <div
          class="icon-download tab-icon"
          v-if="item.index == 2 && !isDownload"
        ></div>
        <div
          class="icon-download-remove tab-icon"
          v-if="item.index == 2 && isDownload"
        ></div>
        <div class="icon-move tab-icon" v-if="item.index == 3"></div>
        <div class="icon-shelf tab-icon" v-if="item.index == 4"></div>
        <div class="tab-text" :class="{ 'remove-text': item.index == 4 }">
          {{ label(item) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";
import { removeLocalStorage, saveBookShelf } from "../../utils/localStorage";
import { removeLocalForage } from "../../utils/localForage";
import { download } from "../../api/book";
export default {
  mixins: [storeShelfMixin],
  computed: {
    isSelected() {
      return this.shelfSelected && this.shelfSelected.length > 0;
    },
    tabs() {
      return [
        {
          label: this.$t("shelf.private"),
          label2: this.$t("shelf.noPrivate"),
          index: 1,
        },
        {
          label: this.$t("shelf.download"),
          label2: this.$t("shelf.delete"),
          index: 2,
        },
        {
          label: this.$t("shelf.move"),
          index: 3,
        },
        {
          label: this.$t("shelf.remove"),
          index: 4,
        },
      ];
    },
    isPrivate() {
      if (!this.isSelected) {
        return false;
      } else {
        // 所选书籍都是私密时才显示关闭私密阅读
        return this.shelfSelected.every((item) => item.private);
      }
    },
    isDownload() {
      if (!this.isSelected) {
        return false;
      } else {
        return this.shelfSelected.every((item) => item.cache);
      }
    },
  },
  data() {
    return {
      popupMenu: null,
    };
  },
  methods: {
    label(item) {
      switch (item.index) {
        case 1:
          return this.isPrivate ? item.label2 : item.label;
          break;
        case 2:
          return this.isDownload ? item.label2 : item.label;
          break;
        default:
          return item.label;
          break;
      }
    },
    onTabClick(item) {
      if (!this.isSelected) {
        return;
      }
      switch (item.index) {
        case 1:
          this.showPrivate();
          break;
        case 2:
          this.showDownlaod();
          break;
        case 3:
          this.dialog().show();
          break;
        case 4:
          this.showRemove();
          break;
      }
    },
    showPrivate() {
      this.popupMenu = this.popup({
        title: this.isPrivate
          ? this.$t("shelf.closePrivateTitle")
          : this.$t("shelf.setPrivateTitle"),
        btn: [
          {
            text: this.isPrivate
              ? this.$t("shelf.close")
              : this.$t("shelf.open"),
            click: () => {
              this.setPrivate();
            },
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            },
          },
        ],
      });
      this.popupMenu.show();
    },
    setPrivate() {
      let isPrivate;
      // 若全为私密，点击关闭按钮后都变为非私密
      if (this.isPrivate) {
        isPrivate = false;
      } else {
        // 若有一个不是私密，点击开启按钮后都变为私密
        isPrivate = true;
      }
      this.shelfSelected.forEach((book) => {
        book.private = isPrivate;
      });
      this.onComplete();
      if (isPrivate) {
        this.simpleToast(this.$t("shelf.setPrivateSuccess"));
      } else {
        this.simpleToast(this.$t("shelf.closePrivateSuccess"));
      }
    },
    showDownlaod() {
      this.popupMenu = this.popup({
        title: this.isDownload
          ? this.$t("shelf.removeDownloadTitle")
          : this.$t("shelf.setDownloadTitle"),
        btn: [
          {
            text: this.isDownload
              ? this.$t("shelf.delete")
              : this.$t("shelf.download"),
            click: () => {
              this.setDownload();
            },
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            },
          },
        ],
      });
      this.popupMenu.show();
    },
    async setDownload() {
      this.onComplete();
      if (this.isDownload) {
        this.removeSelectedBook();
      } else {
        await this.downloadSelectedBook();
        saveBookShelf(this.shelfList);
        this.simpleToast(this.$t("shelf.setDownloadSuccess"));
      }
    },
    showRemove() {
      let title;
      if (this.shelfSelected.length == 1) {
        title = this.$t("shelf.removeBookTitle").replace(
          "$1",
          `《${this.shelfSelected[0].title}》`
        );
      } else {
        title = this.$t("shelf.removeBookTitle").replace(
          "$1",
          this.$t("shelf.selectedBooks")
        );
      }
      this.popupMenu = this.popup({
        title: title,
        btn: [
          {
            text: this.$t("shelf.removeBook"),
            type: "danger",
            click: () => {
              this.removeSelected();
            },
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            },
          },
        ],
      });
      this.popupMenu.show();
    },
    removeSelected() {
      this.shelfSelected.forEach((selected) => {
        this.setShelfList(this.shelfList.filter((book) => book != selected));
      });
      this.setShelfSelected([]);
      this.onComplete();
    },
    hidePopup() {
      this.popupMenu.hide();
    },
    onComplete() {
      this.hidePopup();
      this.setIsEditMode(false);
      saveBookShelf(this.shelfList);
    },
    async downloadSelectedBook() {
      for (let i = 0; i < this.shelfSelected.length; i++) {
        await this.downloadBook(this.shelfSelected[i]).then((book) => {
          book.cache = true;
        });
      }
    },
    downloadBook(book) {
      let text = "";
      const toast = this.toast({ text });
      toast.continueShow();
      return new Promise((resolve, reject) => {
        download(
          book,
          (book) => {
            toast.remove();
            resolve(book);
          },
          reject,
          (progressEvent) => {
            const progress =
              Math.floor((progressEvent.loaded / progressEvent.total) * 100) +
              "%";
            text = this.$t("shelf.progressDownload").replace(
              "$1",
              `${book.fileName}.epub(${progress})`
            );
            toast.updateText(text);
          }
        );
      });
    },
    removeSelectedBook() {
      Promise.all(this.shelfSelected.map((book) => this.removeBook(book))).then(
        (books) => {
          books.map((book) => {
            book.cache = false;
          });
          saveBookShelf(this.shelfList);
          this.simpleToast(this.$t("shelf.removeDownloadSuccess"));
        }
      );
    },
    removeBook(book) {
      return new Promise((resolve, reject) => {
        removeLocalStorage(`${book.categoryText}/${book.fileName}`);
        removeLocalForage(`${book.fileName}`, resolve, reject);
        resolve(book);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.shelf-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 120;
  display: flex;
  width: 100%;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, 0.1);
  .shelf-footer-tab-wrapper {
    flex: 1;
    width: 25%;
    height: 100%;
    .shelf-footer-tab {
      width: 100%;
      height: 100%;
      opacity: 0.5;
      @include columnCenter;
      .tab-icon {
        font-size: px2rem(20);
        color: #666;
      }
      .tab-text {
        margin-top: px2rem(5);
        font-size: px2rem(12);
        color: #666;
      }
      .icon-shelf,
      .remove-text {
        color: $color-pink;
      }
      &.is-selected {
        opacity: 1;
      }
    }
  }
}
</style>