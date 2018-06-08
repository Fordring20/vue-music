<template>
    <transition name="slide">
      <music-list
        :songs="songs"
        :title="title"
        :bgImage="bgImage"
      ></music-list>
    </transition>
</template>
<script>
// vuex取数据的语法糖
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song'
import {getSingerDetail, getFileName} from 'api/singer'
import {ERR_OK} from 'api/config'
import MusicList from 'components/music-list/music-list'

export default {
  // singer对应了getters.js里面的singer
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  data() {
    return {
      songs: [],
      ret: []
    }
  },
  created() {
    this._getDetail()
  },
  methods: {
    // 确保如果用户刷新页面的话,页面会回到某个指定页面
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs(list) {
      // let ret = []
      list.forEach(item => {
        let {musicData} = item
        getFileName(musicData.songid).then((res) => {
          if (res.code === ERR_OK) {
            const url = res.url[res.data[0].id]
            const filename = url.match(/com\/(\S*)\?fromtag=38/)[1]
            // const songmid = res.data[0].mid
            // const data = {
            // filename,
            // songmid
            // }
            // getFinalParam(data).then((res) => {
            // })
            musicData = Object.assign({}, musicData, {
              filename
            })
            this.ret.push(createSong(musicData))
          }
        })
        // if (musicData.songid && musicData.albummid) {
        //   ret.push(createSong(musicData))
        // }
      })
      return this.ret
    }
  },
  components: {
    MusicList
  }
}
</script>
<style lang="stylus" scoped>
    @import "~common/stylus/variable"

    .slide-enter-active, .slide-leave-active
      transition: all 0.3s

    .slide-enter, .slide-leave-to
      transform: translate3d(100%, 0, 0)
</style>
