<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import {getFileName} from 'api/singer'
export default {
  data() {
    return {
      songs: [],
      ret: []
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalSonglist(res.cdlist[0].songlist)
        }
      })
    },
    _normalSonglist(list) {
      list.forEach(item => {
        getFileName(item.songid).then((res) => {
          if (res.code === ERR_OK) {
            const url = res.url[res.data[0].id]
            const filename = url.match(/com\/(\S*)\?fromtag=38/)[1]
            item = Object.assign({}, item, {
              filename
            })
            this.ret.push(createSong(item))
          }
        })
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
