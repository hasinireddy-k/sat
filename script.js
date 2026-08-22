const mainVideo = document.querySelector("#mainVideo");

mainVideo.muted = true;
mainVideo.playsInline = true;
mainVideo.play().catch(() => {});
