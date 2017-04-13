;(function (window) {
    const console = window.console
    /*********************
        start main.js
    *********************/
    class DoubanAudio {
        constructor(options) {
            this.container = document.querySelector(options.el)
            this._initDOM()

            // 给按钮注册点击事件
            this.playBtn.addEventListener('click', () => {
                // 如果当前是暂停
                if (this.audio.paused) {
                    this.play()
                    return
                }
                this.pause()
            })
            // 调节音量
            this.volumeController.addEventListener('click', (e) => {
                // 将点击时的位置除以总长度，得到大概百分比
                let width = e.target.clientWidth
                console.log(width)
                const volume = (e.layerX / width).toFixed(1)
                this.audio.volume = volume
                this.volumeBar.style.width = volume * 100 + '%'
            })
        }
        // 初始化页面结构
        _initDOM () {
            // 创建容器
            const fragmentContainer = document.createDocumentFragment()
            // 创建播放器容器
            const player = this.player = document.createElement('div')
            player.className = 'music__player'
            fragmentContainer.appendChild(player)
            // 创建标题标签
            const title = this.title = document.createElement('h2')
            title.className = 'music__title'
            fragmentContainer.appendChild(title)
            // 创建歌手标签
            const singer = this.singer = document.createElement('p')
            singer.className = 'music__singer'
            fragmentContainer.appendChild(singer)
            // 创建真正的播放器，audio 标签
            const audio = this.audio = document.createElement('audio')
            audio.className = 'player__source'
            fragmentContainer.appendChild(audio)
            // 时间显示
            const time = this.time = document.createElement('span')
            time.className = 'music__currenttime'
            fragmentContainer.appendChild(time)
            // 声音 icon
            const volumeIcon = this.volumeicon = document.createElement('i')
            volumeIcon.className = 'fa fa-volume-up music__volumeicon'
            fragmentContainer.appendChild(volumeIcon)
            // 音量控制
            const volumeController = this.volumeController = document.createElement('div')
            volumeController.className = 'music__volume'
            const volumebar = this.volumeBar = document.createElement('span')
            volumebar.className = 'music__volumebar'
            volumeController.appendChild(volumebar)
            fragmentContainer.appendChild(volumeController)
            // 播放进度条
            const progressCon = document.createElement('div')
            progressCon.className = 'player__progress'
            const progressBar = this.progressBar = document.createElement('span')
            progressBar.className = 'player__progressbar'
            progressCon.appendChild(progressBar)
            fragmentContainer.appendChild(progressCon)
            // 播放按钮
            const playBtn = this.playBtn = document.createElement('span')
            playBtn.className = 'player__play'
            playBtn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>'
            fragmentContainer.appendChild(playBtn)
            // 快进按钮
            const speedBtn = this.speedBtn = document.createElement('span')
            speedBtn.className = 'player__speed'
            speedBtn.innerHTML = '<i class="fa fa-forward" aria-hidden="true"></i>'
            fragmentContainer.appendChild(speedBtn)
            // 下一首按钮
            const nextBtn = this.nextBtn = document.createElement('span')
            nextBtn.className = 'player__next'
            nextBtn.innerHTML = '<i class="fa fa-step-forward" aria-hidden="true"></i>'
            fragmentContainer.appendChild(nextBtn)
            // 切换播放模式按钮
            const styleBtn = this.styleBtn = document.createElement('span')
            styleBtn.className = 'player__style'
            styleBtn.innerHTML = '<i class="fa fa-random" aria-hidden="true"></i>'
            fragmentContainer.appendChild(styleBtn)

            this.container.appendChild(fragmentContainer)
        }
        // 展示 loading 动画
        showLoading () {
            let loading = this.loading
            if (!loading) {
                loading = this.loading = document.createElement('div')
            }
            loading.style = ';position: absolute;left: 0;top: 0;bottom: 0;right: 0;background-color: #fff;display: flex;align-items: center;justify-content: center;'
            loading.innerText = '正在加载中...'
            this.container.style.position = 'relative'
            this.container.appendChild(loading)
        }
        // 隐藏 loading 动画
        hideLoading () {
            this.container.removeChild(this.loading)
        }
        // 切换播放音乐
        change (music) {
            this.currentMusic = music
            // 标题
            this.title.innerText = music.songname
            // 歌手
            const singer = music.singer.map(singer => {
                return singer.name
            }).join(', ')
            this.singer.innerText = singer
            // 时间
            this.time.innerText = '00:00/00:00'
            // audio
            this.audio.src = music.audiourl
            // 音量
            this.volumeBar.style.width = (this.audio.volumn || 1) * 100 + '%'

            // 总时长
            // let duration = 0
            // this.audio.addEventListener('canplay', (e) => {
            //     this.currentMusic.duration = parseInt(e.target.duration)
            // })

            // 都切换好了后，开始播放
            this.play()
        }
        // 播放
        play () {
            this.audio.play()
            // 并将图片更换为暂停
            this.playBtn.querySelector('.fa').className = 'fa fa-pause'
            this.progress() 
        }
        // 暂停播放
        pause () {
            this.audio.pause()
            this.playBtn.querySelector('.fa').className = 'fa fa-play'
            this.timer && clearInterval(this.timer)
        }
        // 处理进度
        progress () {
            // 处理进度
            const player = this.audio
            const time = this.time
            const currentMusic = this.currentMusic
            const progressBar = this.progressBar
            function progress () {
                // 如果是暂停状态，就不做处理
                if (player.paused) {
                    return
                }
                let current = player.currentTime
                const duration = player.duration || 0
                time.innerText = Utils.formatSeconds(current) + '/' + Utils.formatSeconds(duration)
                // 计算播放百分比
                // console.log(typeof current, typeof duration, current, duration, current / duration)
                let per = current / duration * 100 + '%'
                progressBar.style.right = `calc(100% - ${per})`
            }
            this.timer = setInterval(() => {
                progress()
            }, 1000)
        }
    }
    /*********************
       将构造函数暴露至全局
    *********************/
    window.DoubanAudio = DoubanAudio
})(window)