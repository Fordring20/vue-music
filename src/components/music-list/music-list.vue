<template>
   <div class="music-list">
     <div class="back" @click="back">
       <i class="icon-back"></i>
     </div>
     <h1 class="title" v-html="title"></h1>
     <div class="bg-image" :style="bgStyle" ref="bgImage">
       <div class="play-wrapper">
         <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
           <i class="icon-play"></i>
           <span class="text">随机播放全部</span>
         </div>
       </div>
       <div class="filter" ref="filter"></div>
     </div>
     <div class="bg-layer" ref="layer"></div>
     <!-- 让scroll正确进行计算,添加一个data属性,添加一个probetype和listenscroll传递到scroll开启监听滚动,添加一个scroll事件进行 -->
     <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
       <!-- 在songlist外包裹一个div用于控制其内部songlist的样式 -->
       <div class="song-list-wrapper">
         <song-list @select="selectItem" :songs="songs" :rank="rank"></song-list>
       </div>
       <div class="loading-container" v-show="!songs.length">
         <loading></loading>
       </div>
     </scroll>
   </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
// 对不同浏览器css3需要前缀做的js封装
import {prefixStyle} from 'common/js/dom'
import Loading from 'base/loading/loading'
// 调用actions方法
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
// 首先是导入的数据,用props设置接收
export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  // 维护一个纵向滚动的值
  data() {
    return {
      scrollY: 0
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    // 缓存这个高度，不会每次都进行dom操作
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  // 添加scroll滚动的方法,这样可以实时拿到scrollY的值
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    selectItem(item, index) {
      // 子组件传递$emit到父组件,首先要在伏组件中对应的子组件添加一个对应的事件select事件接收传递的参数,然后在methods中进行处理
      // 此时子组件传递了多个参数到父组件,然后对vuex中的部分参数要进行多个mutation的操作,这个时候就需要使用到action
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  watch: {
    // 实现歌手详细列表上下滚动
    scrollY(newY) {
      console.log(newY)
      let translateY = Math.max(this.minTranslateY, newY)
      // 设置zindex进行动态的变化
      let zIndex = 0
      let scale = 1
      let blur = 0
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      // 根据这个公式判断往下滑动的时候和图片高度有相关
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        // 向上滑动的时候加一个图片模糊的效果
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur})px`
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      // 这里的zindex为什么写在外面?就是当newY没有滚动到某个值的时候zindex为0,否知为10,这样写减少DOM操作
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>