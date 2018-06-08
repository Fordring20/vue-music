import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    g_tk: 5381,
    singermid: singerId
  })
  return jsonp(url, data, options)
}

export function getFileName(songid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg'
  const data = {
    songid: songid,
    tpl: 'yqq_song_detail',
    format: 'jsonp'
  }
  const options = {
    param: 'callback'
  }
  return jsonp(url, data, options)
}

export function getFinalParam(item) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=872989112&jsonpCallback=MusicJsonCallback06459212607938936&loginUin=11297258&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&cid=205361747&callback=MusicJsonCallback06459212607938936&uin=11297258&guid=9136027940'
  const data = item

  return jsonp(url, data, options)
}