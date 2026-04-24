export interface Frame {
  time: number;
  dataUrl: string; // Base64 JPEG
}

export const extractFramesFromVideo = async (
  videoFile: File,
  maxFrames: number = 20
): Promise<Frame[]> => {
  return new Promise((resolve, reject) => {
    const videoUrl = URL.createObjectURL(videoFile);
    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      const duration = video.duration;
      // If video is short, we might not need maxFrames. 
      // But let's calculate interval based on maxFrames to not exceed it.
      // If duration is 60s, maxFrames=20, interval=3s.
      // If duration is 10s, maxFrames=20, interval=0.5s.
      const interval = duration / maxFrames;
      const frames: Frame[] = [];
      let currentTime = 0;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Reduce resolution to save API payload size (e.g., max 512px on longest side)
      const maxDim = 512;
      let width = video.videoWidth;
      let height = video.videoHeight;
      if (width > height) {
        if (width > maxDim) {
          height *= maxDim / width;
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width *= maxDim / height;
          height = maxDim;
        }
      }
      canvas.width = width;
      canvas.height = height;

      const captureFrame = () => {
        if (currentTime >= duration || frames.length >= maxFrames) {
          URL.revokeObjectURL(videoUrl);
          resolve(frames);
          return;
        }

        video.currentTime = currentTime;
      };

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          frames.push({ time: currentTime, dataUrl });
        }
        currentTime += interval;
        captureFrame();
      };

      video.onerror = (e) => {
        URL.revokeObjectURL(videoUrl);
        reject(new Error('Error loading video to extract frames.'));
      };

      // Start capturing
      captureFrame();
    };
  });
};
