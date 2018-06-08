// 对state做一些映射,从vuex中获取state,数据到组件中,通过mapgetters拿到这些数据,类似计算属性功能
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

export const disc = state => state.disc

export const toplist = state => state.toplist