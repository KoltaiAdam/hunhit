<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { usePlayer, PlayerState } from '@vue-youtube/core'

import { ref, nextTick } from 'vue'

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
      <button v-if="readerIsActive" @click="stopStream">Kamera kikapcs</button>
      <button v-else @click="playStream">Következő dal</button>
    </div>
    <div class="stream">
      <qrcode-stream v-if="readerIsActive" @detect="onResult" @error="onError" @camera-on="onCameraOn">
        <div v-if="readerIsLoading" class="loading-indicator">Kamera betöltése</div>
      </qrcode-stream>
    </div>
    <div class="youtube">
      <div class="youtube-div" ref="youtube" @ready="onReady" />
    </div>
    <div class="youtube-control">
      <button v-if="playerState === -1 || playerState === 5 || playerState === 2 || playerState === 0" @click="togglePlay" :disabled="videoId === ''">Indít</button>
      <button v-else-if="playerState === 3" disabled>Betöltés</button>
      <button v-else @click="togglePlay">Állj</button>
    </div>
    <div v-if="readerError" class="error">{{ readerError }}</div>
  </main>
</template>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  button {
    margin: 2rem;
    padding: 2rem;
    font-size: 2rem;
    width: 20rem;
  }
  .btn-reset {
    display: none;
  }
  iframe {
    width: 0;
    height: 0;
  }
  .loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: grey;
  }
</style>