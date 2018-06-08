<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import {getFileName} from 'api/singer'
export default {
  computed: {
    title() {
      return this.toplist.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'toplist'
    ])
  },
  data() {
    return {
      ret: [],
      songs: [],
      rank: true
    }
  },
  created() {
    this._getMusicList()
  },
  methods: {
    _getMusicList() {
      if (!this.toplist.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.toplist.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._narmalMusicList(res.songlist)
        }
      })
    },
    _narmalMusicList(list) {
      list.forEach(item => {
        getFileName(item.data.songid).then(res => {
          if (res.code === ERR_OK) {
            const url = res.url[res.data[0].id]
            const filename = url.match(/com\/(\S*)\?fromtag=38/)[1]
            item = Object.assign({}, item.data, {
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
    transition: all 0.3s ease
  .slide-enter, .slide-leave-to
    transform : translate3d(100%, 0, 0)
</style>
