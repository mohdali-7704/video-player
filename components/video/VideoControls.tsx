'use client';

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  maxWatchedTime: number;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onRewind: (seconds: number) => void;
  onFullscreen: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export default function VideoControls({
  isPlaying,
  currentTime,
  duration,
  maxWatchedTime,
  isFullscreen,
  volume,
  isMuted,
  onPlay,
  onPause,
  onSeek,
  onRewind,
  onFullscreen,
  onVolumeChange,
  onToggleMute
}: VideoControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeekBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * duration;

    // Only allow seeking to watched portions or behind current position
    if (seekTime <= maxWatchedTime) {
      onSeek(seekTime);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4">
      {/* Progress Bar */}
      <div
        className="w-full h-2 bg-gray-700 rounded-full cursor-pointer mb-4 relative"
        onClick={handleSeekBarClick}
      >
        {/* Max watched indicator */}
        <div
          className="absolute h-2 bg-gray-600 rounded-full"
          style={{ width: `${(maxWatchedTime / duration) * 100}%` }}
        />
        {/* Current position */}
        <div
          className="absolute h-2 bg-blue-500 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full hover:bg-blue-600 transition"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => onRewind(10)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition text-sm"
            aria-label="Rewind 10 seconds"
          >
            ⏪ 10s
          </button>

          <button
            onClick={() => onRewind(30)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition text-sm"
            aria-label="Rewind 30 seconds"
          >
            ⏪ 30s
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              ) : volume < 0.5 ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              aria-label="Volume"
            />
          </div>

          <button
            onClick={onFullscreen}
            className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded hover:bg-gray-600 transition"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
