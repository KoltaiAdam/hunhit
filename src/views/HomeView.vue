<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { usePlayer, PlayerState } from '@vue-youtube/core'

import { ref, nextTick } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

let videoId = ref('')
const youtube = ref()

let playerState = ref()
let readerIsActive = ref(false)
let readerIsLoading = ref(false)
let readerError = ref()

const { onReady, togglePlay, onStateChange } = usePlayer (videoId, youtube, {
  cookie: false,
  playerVars: {
    autoplay: 1,
    showinfo: 0  
  },
  height: 0,
  width: 0
})

onReady((event) => {
  event.target.playVideo();
});

onStateChange((event) => {
  playerState.value = event.data
  if (event.data == PlayerState.PLAYING) {
    console.log("I'm playing", videoId.value)
  }
});

async function playStream() {
  readerIsLoading.value = true
  readerIsActive.value = false
  await nextTick()
  readerIsActive.value = true
}
async function stopStream() {
  readerIsActive.value = false
  await nextTick()
}

function onResult (result) {
  if (!result) {
    return
  }
  readerIsActive.value = false
  videoId.value = extractVideoID(result[0].rawValue)
}

function onCameraOn () {
  readerIsLoading.value = false
}

function onError (error) {
  readerError.value = error.name
}

function reloadPage() {
  window.location.reload()
}

function extractVideoID(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[7].length == 11) {
    return match[7];
  } else {
    console.log("Could not extract video ID.");
  }
}
</script>

<template>
  <main>
    <div v-if="readerIsActive" class="stream">
      <qrcode-stream @detect="onResult" @error="onError" @camera-on="onCameraOn">
      </qrcode-stream>
    </div>
    <div class="youtube">
      <div class="youtube-div" ref="youtube" @ready="onReady" />
    </div>
    <div class="controls">
      <div class="stream-control">
        <button v-if="readerIsActive" @click="stopStream">
          <FontAwesomeIcon v-if="readerIsLoading" :icon="['fas', 'hourglass-half']" />
          <FontAwesomeIcon v-else :icon="['fas', 'power-off']" />
        </button>
        <button v-else @click="playStream">
          <FontAwesomeIcon :icon="['fas', 'camera']" />
        </button>
      </div>
      <div class="youtube-control">
        <button v-if="playerState === -1 || playerState === 5 || playerState === 2 || playerState === 0" @click="togglePlay" :disabled="videoId === ''">
          <FontAwesomeIcon :icon="['fas', 'play']" />
        </button>
        <button v-else-if="playerState === 3" disabled>
          <FontAwesomeIcon :icon="['fas', 'hourglass-half']" />
        </button>
        <button v-else @click="togglePlay">
          <FontAwesomeIcon :icon="['fas', 'stop']" />
        </button>
      </div>
    </div>
    <div v-if="readerError" class="error">
      <button @click="reloadPage" class="error">
        <FontAwesomeIcon :icon="['fas', 'camera-rotate']" />
      </button>
      {{ readerError }}</div>
  </main>
</template>

<style>
  main {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
  }
  .stream {
    max-width: 350px;
    margin: 20px 15px;
    border: 5px solid white;
    border-radius: .5rem;
  }
  button {
    background: url(../assets/background_semi_transparent.png);
    background-size: 10rem 10rem;
    border: 0;
    color: #aaaaaa;
    font-size: 3rem;
    height: 10rem;
    margin: .5rem;
    padding: 0;
    width: 10rem;
  }
  button:disabled {
    color: #333333;
  }
  .error {
    color: lightcoral;
  }
  .controls {
    display: flex;
    justify-content: center;
  }
  iframe {
    width: 0;
    height: 0;
  }
</style>