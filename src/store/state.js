import {playMode} from 'common/js/config'

// 储存所有的状态
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  toplist: {}
}

export default state