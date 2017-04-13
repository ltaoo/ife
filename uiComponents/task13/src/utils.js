;(function (window) {
    // 检查 jquery
    if (!window.$) {
        console.error('请先引入 jquery.js')
    }
    /***************
        工具方法
     ***************/
    window.Utils = {}
    /* 
     * 使用 qq 音乐接口搜索音乐列表
     * @param <String> query
     * @param <Number> page
     * @return <Promise>
     */
    Utils.searchMusic = function (query, page = 1) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&remoteplace=sizer.yqq.song_next&searchid=151342943803015700&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=${page}&n=20&w=${query}&g_tk=755250217&loginUin=184009428&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
                type: 'GET',
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'callback',
                success (res) {
                    let list = res.data.song.list.map(music => {
                        return Object.assign(music, {
                            audiourl: `http://ws.stream.qqmusic.qq.com/${music.songid}.m4a?fromtag=46`
                        })
                    })
                    resolve(list)
                },
                error (err) {
                    reject(err)
                }
            })
        })
    }
    /* 
     * 将秒数转换为时分秒
     * @param <Number> value
     * @return <String>
     */
    Utils.formatSeconds = function (value) {
        let second = parseInt(value)
        let hour = 0
        let minute = 0
        if (second >= 60) {
            minute = parseInt(second / 60)
            second = parseInt(second % 60)

            if (minute >= 60) {
                hour = parseInt(minute / 60)
                minute = parseInt(minute % 60)
            }
        }
        let result = second < 10 ? `0${second}` : second
        if (minute > 0) {
            result = (minute < 10 ? `0${minute}` : minute) + ':' + result
        } else {
            result = `00:${result}`
        }
        if (hour > 0) {
            result = (hour < 10 ? `0${hour}` : hour) + ':' + result
        }

        return result
    }
})(window)