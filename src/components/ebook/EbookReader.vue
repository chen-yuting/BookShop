<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import Epub from "epubjs";
import { ebookMixin } from "../../utils/mixin";
import {
  getFontFamily,
  getFontSize,
  getLocation,
  getTheme,
  saveFontFamily,
  saveFontSize,
  saveTheme,
} from "../../utils/localStorage";
import { flatten } from "../../utils/book";
global.ePub = Epub;
export default {
  mixins: [ebookMixin],
  mounted() {
    const fileName = this.$route.params.fileName.split("|").join("/");
    this.setFileName(fileName).then(() => {
      this.initEpub();
    });
  },
  methods: {
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation();
        });
        this.hideTitleAndMenu();
      }
    },

    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation();
        });
        this.hideTitleAndMenu();
      }
    },

    toggleTitleAndMenu() {
      this.setMenuVisible(!this.menuVisible);
      this.setSettingVisible(-1);
      this.setFontFamilyVisible(false);
    },

    initFontFamily() {
      let font = getFontFamily(this.fileName);
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily);
      } else {
        this.rendition.themes.font(font);
        this.setDefaultFontFamily(font);
      }
    },

    initFontSize() {
      let fontSize = getFontSize(this.fileName);
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize);
      } else {
        this.rendition.themes.fontSize(fontSize + "px");
        this.setDefaultFontSize(fontSize);
      }
    },

    initTheme() {
      let defaultTheme = getTheme(this.fileName);
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name;
        saveTheme(this.fileName, defaultTheme);
      }
      this.setDefaultTheme(defaultTheme);
      this.themeList.forEach((theme) => {
        this.rendition.themes.register(theme.name, theme.style);
      });
      this.rendition.themes.select(defaultTheme);
    },

    initRendition() {
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      const location = getLocation(this.fileName);
      if (location) {
        this.display(location, () => {
          this.initFontSize();
          this.initFontFamily();
          this.initTheme();
          this.initGlobalStyle();
        });
      } else {
        this.display(null, () => {
          this.initFontSize();
          this.initFontFamily();
          this.initTheme();
          this.initGlobalStyle();
        });
      }

      this.rendition.hooks.content.register((content) => {
        Promise.all([
          content.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`
          ),
          content.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`
          ),
          content.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`
          ),
          content.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/cabin.css`
          ),
        ]).then(() => {});
      });
    },

    initGesture() {
      //手指左右滑动翻页
      this.rendition.on("touchstart", (event) => {
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartTime = event.timeStamp;
      });
      this.rendition.on("touchend", (event) => {
        this.touchEndX = event.changedTouches[0].clientX;
        this.touchEndTime = event.timeStamp;
        const offsetX = this.touchEndX - this.touchStartX;
        const time = this.touchEndTime - this.touchStartTime;
        if (time < 500 && offsetX > 40) {
          this.prevPage();
        } else if (time < 500 && offsetX < -40) {
          this.nextPage();
        } else {
          this.toggleTitleAndMenu();
        }
        event.stopPropagation();
      });
    },

    parseBook() {
      this.book.loaded.cover.then((cover) => {
        this.book.archive.createUrl(cover).then((url) => {
          this.setCover(url);
        });
        this.book.loaded.metadata.then((metadata) => {
          this.setMetadata(metadata);
        });
        this.book.loaded.navigation.then((navigation) => {
          const navItem = flatten(navigation.toc);
          function find(item, level = 0) {
            return !item.parent
              ? level
              : find(
                  navItem.filter(
                    (parentItem) => parentItem.id == item.parent
                  )[0],
                  ++level
                );
          }
          navItem.forEach((item) => {
            item.level = find(item);
          });
          this.setNavigation(navItem);
        });
      });
    },

    initEpub() {
      const url =
        `${process.env.VUE_APP_RES_URL}/epub/` + this.fileName + ".epub";
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      this.initRendition();
      this.initGesture();
      this.parseBook();
      this.book.ready
        .then(() => {
          return this.book.locations.generate(
            (750 * (window.innerWidth / 375) * getFontSize(this.fileName)) / 16
          );
        })
        .then((result) => {
          this.setBookAvailable(true);
          this.refreshLocation();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
</style>