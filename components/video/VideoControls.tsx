'use client';

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  maxWatchedTime: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onRewind: (seconds: number) => void;
}

export default function VideoControls({
  isPlaying,
  currentTime,
  duration,
  maxWatchedTime,
  onPlay,
  onPause,
  onSeek,
  onRewind
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

        <div className="text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}
