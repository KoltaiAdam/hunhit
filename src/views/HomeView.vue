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
    <div class="control">
      <button v-if="readerIsActive" @click="stopStream">
        <FontAwesomeIcon v-if="readerIsLoading" :icon="['fas', 'hourglass-half']" />
        <FontAwesomeIcon v-else :icon="['fas', 'power-off']" />
      </button>
      <button v-else @click="playStream">
        <FontAwesomeIcon :icon="['fas', 'camera']" />
      </button>
    </div>
    <div class="stream">
      <qrcode-stream v-if="readerIsActive" @detect="onResult" @error="onError" @camera-on="onCameraOn">
      </qrcode-stream>
    </div>
    <div class="youtube">
      <div class="youtube-div" ref="youtube" @ready="onReady" />
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
    height: 300px;
    width: 100%;
  }
  button {
    background: url(../assets/background_semi_transparent.png);
    background-size: 15rem 15rem;
    border: 0;
    color: #aaaaaa;
    font-size: 4rem;
    height: 15rem;
    margin: .5rem;
    padding: 0;
    width: 15rem;
  }
  button:disabled {
    color: #333333;
  }
  .error {
    color: lightcoral;
  }

  iframe {
    width: 0;
    height: 0;
  }
</style>