$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "HUYNH PLAYER";


const playlistElement = $('.playlist');
const cdElement = $('.cd');
const heading = $('header > h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const playerElement = $('.player');
const progressElement = $('#progress');
const nextSongElement = $('.btn-next');
const backSongElement = $('.btn-prev');
const btn_random = $('.btn-random');
const btn_repeat = $('.btn-repeat');
const playListSong = $$('.song');

const app = {
    CurentIndexDefault: 0,
    isPlaying: false,
    isRamdom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Nấu Ăn Cho Em 1",
            singer: 'Đen Vâu',
            path: './assets/song/nau-an-cho-em-den-vau-ft-PiaLinh.mp3',
            image: './assets/img/den.jpg'
        },
        {
            name: "Trái Tim Em Cũng Biết Đau",
            singer: 'Bảo Anh',
            path: './assets/song/y2mate.com - Bảo Anh  Trái Tim Em Cũng Biết Đau ft Mr Siro Lyric Video.mp3',
            image: 'https://media.techz.vn/media2019/source/aaaLinh/2021/t4/bao-anh-7.jpg'
        },
        {
            name: "Nấu Ăn Cho Em 3",
            singer: 'Đen Vâu',
            path: './assets/song/nau-an-cho-em-den-vau-ft-PiaLinh.mp3',
            image: './assets/img/den.jpg'
        },
        {
            name: "Nấu Ăn Cho Em 4",
            singer: 'Đen Vâu',
            path: './assets/song/nau-an-cho-em-den-vau-ft-PiaLinh.mp3',
            image: './assets/img/den.jpg'
        },
        {
            name: "Nấu Ăn Cho Em 5",
            singer: 'Đen Vâu',
            path: './assets/song/nau-an-cho-em-den-vau-ft-PiaLinh.mp3',
            image: './assets/img/den.jpg'
        },
        {
            name: "Nấu Ăn Cho Em 6",
            singer: 'Đen Vâu',
            path: './assets/song/nau-an-cho-em-den-vau-ft-PiaLinh.mp3',
            image: './assets/img/den.jpg'
        }
    ],
    setconfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function () {
        const html = this.songs.map((value, index) => {
            return `
            <div data-index= ${index} class="song ${index === this.CurentIndexDefault ? 'active' : ''}">
                <div class="thumb"
                    style="background-image: url('${value.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${value.name}</h3>
                    <p class="author">${value.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlistElement.innerHTML = html.join('');
    },
    handleEvents: function () {

        const cdWidth = cdElement.offsetWidth;
        const _this = this;
        // Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate(
            [
                {
                    transform: 'rotate(0deg)'
                },
                {
                    transform: 'rotate(360deg)'
                }
            ],
            {
                duration: 10000, // 10 giây
                iterations: Infinity
            }
        );
        cdThumbAnimate.pause();

        // Xử lý phóng to , thu nhỏ CD
        document.onscroll = function (e) {
            const scrollTop = window.document.documentElement.scrollTop || window.scrollY;
            console.log(scrollTop)
            const newCdWidth = cdWidth - scrollTop;
            cdElement.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cdElement.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi play 

        playBtn.onclick = () => {
            if (_this.isPlaying) {
                setTimeout(() => {
                    audio.pause();
                }, 200)
            } else {
                setTimeout(() => {
                    audio.play();
                }, 200)

            }
        }
        // khi song được play
        audio.onplay = () => {
            _this.isPlaying = true;
            playerElement.classList.add('playing');
            cdThumbAnimate.play();
        }
        // khi song được pause
        audio.onpause = () => {
            _this.isPlaying = false;
            playerElement.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // khi tiến độ bài hát thay đỏi
        audio.ontimeupdate = () => {

            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progressElement.value = progressPercent;
            }

        }

        // xử lý khi tua song
        progressElement.oninput = e => {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
            console.log(e.target.value * audio.duration / 100);
        }
        // xử lý next bài;
        nextSongElement.onclick = function () {
            setTimeout(() => {
                if (_this.isRamdom) {
                    _this.RandomSong();

                } else {
                    _this.NextSong();
                }
                audio.play();
            }, 300)
        }
        // xử lý back bài;
        backSongElement.onclick = function () {
            setTimeout(() => {
                if (_this.isRamdom) {
                    _this.RandomSong();

                } else {
                    _this.BackSong();
                }
                audio.play();
            }, 300)
        }
        // xử lý hết bài random
        btn_random.onclick = function (e) {
            _this.isRamdom = !_this.isRamdom;
            _this.setconfig('isRamdom', _this.isRamdom);
            btn_random.classList.toggle('active', _this.isRamdom)
        }

        // xử lý khi kết thúc bài
        audio.onended = () => {
            setTimeout(() => {
                if (_this.isRepeat) {

                    audio.play();
                } else {

                    _this.NextSong();
                    audio.play();
                }
            }, 500)
        }
        // xử lý khi lặp lại
        btn_repeat.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setconfig('isRepeat', _this.isRepeat);
            btn_repeat.classList.toggle('active', _this.isRepeat);

        }

        // lawnsg nghe
        playerElement.onclick = function (e) {
            const SongNode = e.target.closest('.song:not(.active)');
            console.log(SongNode)
            // click vafo song
            if (e.target.closest('.song:not(.active)') || e.target.closest('.option')) {
                // xử lý click vào song
                if (e.target.closest('.song:not(.active)')) {
                    _this.CurentIndexDefault = Number(SongNode.getAttribute('data-index'))// or SongNode.dataset.index
                    _this.loadCurentSong();
                    _this.render();
                    audio.play();
                }
            }
        }

    },

    loadCurentSong: function () {
        heading.textContent = this.getCurentSong().name;
        cdThumb.style.background = `url(${this.getCurentSong().image})`;
        audio.src = `${this.getCurentSong().path}`

    },
    getCurentSong() {

        return this.songs[this.CurentIndexDefault];
    },
    NextSong: function () {

        this.CurentIndexDefault++;
        if (this.CurentIndexDefault >= this.songs.length) {
            this.CurentIndexDefault = 0;
        }
        this.getCurentSong();
        this.loadCurentSong();
        this.render();
    }
    ,
    BackSong: function () {

        this.CurentIndexDefault--;
        if (this.CurentIndexDefault < 0) {
            this.CurentIndexDefault = this.songs.length - 1;
        }
        this.getCurentSong();
        this.loadCurentSong();
        this.render();
    },
    RandomSong: function () {
        var x = this.CurentIndexDefault;
        let Newindex;
        do {

            Newindex = Math.floor(Math.random() * this.songs.length);
        }
        while (Newindex === x)
        this.CurentIndexDefault = Newindex;
        this.getCurentSong();
        this.loadCurentSong();
        this.render();
    }
    ,
    RepetSong: function () {
        this.getCurentSong();
        this.loadCurentSong();
    },

    loadConfig: function () {
        this.isRamdom = this.config.isRamdom;
        this.isRepeat = this.config.isRepeat;
    },


    start: function () {

        //load file Config
        this.loadConfig();
        // show trang thai ban dau cua button repeat va random
        btn_repeat.classList.toggle('active', this.isRepeat);
        btn_random.classList.toggle('active', this.isRamdom);
        // lấy ra thông tin bài hát đầu tiên
        this.getCurentSong();
        // xử lý 
        this.loadCurentSong();
        // xử lý các sự kiện (Dom Event)
        this.handleEvents();
        // reder playlist
        this.render();



    }
}
app.start()