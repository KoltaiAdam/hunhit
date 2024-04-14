<script setup>
import { StreamQrcodeBarcodeReader } from 'vue3-barcode-qrcode-reader'
import { usePlayer, PlayerState } from '@vue-youtube/core'

import { ref } from 'vue'

const refCamera = ref(StreamQrcodeBarcodeReader)

let videoId = ref('xbCtRr4_qP4')
const youtube = ref()

let playerState = ref()
let readerIsActive = ref(false)

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

function playStream() {
  readerIsActive.value = true
  refCamera.value?.onCanPlay()
}

function stopStream () {
  readerIsActive.value = false
  refCamera.value?.onCanStop()
}

function onLoaded () {
  console.log('Component loaded')
}

function onLoading () {
  console.log('Component loading')
}

function onResult (result) {
  if (!result) {
    return
  }
  readerIsActive.value = false
  videoId.value = extractVideoID(result?.text)
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
    <button v-if="readerIsActive" @click="stopStream">Szünet</button>
    <button v-else @click="playStream">Következő dal</button>
    <StreamQrcodeBarcodeReader
      ref="refCamera"
      capture="shoot"
      @loaded="onLoaded"
      @onloading="onLoading"
      @result="onResult"
      show-on-stream
    />
    <div class="youtube-div" ref="youtube" @ready="onReady" />
    <button v-if="playerState === -1 || playerState === 5 || playerState === 2 || playerState === 0" @click="togglePlay">Start</button>
    <button v-else @click="togglePlay">Stop</button>
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
  }
  .btn-reset {
    display: none;
  }
  iframe {
    width: 0;
    height: 0;
  }
</style>