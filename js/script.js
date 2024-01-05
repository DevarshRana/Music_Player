const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
  loadMusic(musicIndex); // calling load music function once window loaded
  playingNow();
});

//load music function
const loadMusic = (indexNumb) => {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `IMAGES/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `MUSIC/${allMusic[indexNumb - 1].src}.mp3`;
};

// play music function
const playMusic = () => {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
};

// pause music function
const pauseMusic = () => {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
};

//prev music function
const prevMusic = () => {
  musicIndex--; //decrement of musicIndex by 1
  //if musicIndex is less than 1 then musicIndex will be the array length so the last music play
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
};

//next music function
const nextMusic = () => {
  musicIndex++; //increment of musicIndex by 1
  //if musicIndex is greater than array length then musicIndex will be 1 so the first music play
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
};

//play or music button event
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  //if isPlayMusic is true then call pauseMusic else call playMusic
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

//prev music button event
prevBtn.addEventListener("click", () => {
  prevMusic();
});
// next music button event
nextBtn.addEventListener("click", () => {
  nextMusic(); //calling next music function
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; // getting current time of song
  const duration = e.target.duration; // getting total duration of song
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current");
  let musicDuration = wrapper.querySelector(".duration");
  mainAudio.addEventListener("loadeddata", () => {
    //update song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      //adding  0 if sec is less than 10
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });
  //update playing song total duration
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    //adding  0 if sec is less than 10
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// lets update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth; //getting width of progress bar
  let clickedOffsetX = e.offsetX; //getting offset X value
  let songDuration = mainAudio.duration; //getting song total duration

  mainAudio.currentTime = (clickedOffsetX / progressWidthval) * songDuration;
  playMusic();
});

// let's work on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  // first we get the innerText of the icon then we'll change accordingly
  let getText = repeatBtn.innerText; // getting innertext of icon
  // let's do different changes on different icon click using switch
  switch (getText) {
    case "repeat": // if the icon is repeat then change it to repeat_one
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song Looped");
      break;
    case "repeat_one": // if the icon is repeat_one then change it to shuffle
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback Shuffle");
      break;
    case "shuffle": // if the icon is shuffle then change it to repeat
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist Looped");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  // we'll do according to the icon means if user has set icon to
  // loop song then we'll repeat the current song and will do accordingly
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch (getText) {
    case "repeat":
      nextMusic(); //calling nextMusic function
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //setting audio current time to 0
      loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
      playMusic(); //calling playMusic function
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusic.length + 1); //genereting random index/numb with max range of array length
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
      musicIndex = randIndex; //passing randomIndex to musicIndex
      loadMusic(musicIndex);
      playMusic();
      playingNow();
      //   playingSong();
      break;
  }
});

moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i + 1}">
            <div class="row">
              <span>${allMusic[i].name}</span>
              <p>${allMusic[i].artist}</p>
            </div>
            <audio class="${allMusic[i].src}" src="MUSIC/${
    allMusic[i].src
  }.mp3"></audio>
            <span id="${allMusic[i].src}" class="audio-duration">2:52</span>
          </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      //adding  0 if sec is less than 10
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

const allLiTags = ulTag.querySelectorAll("li");
const playingNow = () => {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
};

const clicked = (element) => {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
};
