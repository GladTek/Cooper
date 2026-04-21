import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

type SysStatus = 'IDLE' | 'READY' | 'PLAYING' | 'PAUSED' | 'COMPLETE';

export default function AudioPlayer({ src, title = "AUDIO_LOG_01" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [sysStatus, setSysStatus] = useState<SysStatus>("IDLE");
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Random data stream for TARS effect
  const [dataStream, setDataStream] = useState("00.00.00");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      // Update fake data stream
      setDataStream((Math.random() * 10000).toFixed(2));
    };

    const setAudioDuration = () => {
      if (audio.duration && audio.duration !== Infinity) {
        setDuration(audio.duration);
        setSysStatus("READY");
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setSysStatus("COMPLETE");
    };

    const handlePlay = () => setSysStatus("PLAYING");
    const handlePause = () => setSysStatus("PAUSED");

    // Check if metadata is already loaded
    if (audio.readyState >= 1) {
      setAudioDuration();
    }

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('durationchange', setAudioDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('durationchange', setAudioDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Docking Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0 && (isPlaying || progress > 0)) {
              setIsDocked(true);
          } else {
              setIsDocked(false);
          }
      },
      { threshold: 0 }
    );
    
    const wrapper = document.getElementById('audio-player-wrapper');
    if (wrapper) {
        observer.observe(wrapper);
    }
    
    return () => observer.disconnect();
  }, [isPlaying, progress]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <motion.div
        layout
        initial={false}
        animate={isDocked ? {
             position: 'fixed' as const,
             bottom: 24,
             left: '50%',
             x: '-50%',
             width: '95%',
             maxWidth: '600px',
             zIndex: 50,
        } : {
             position: 'relative' as const,
             bottom: 'auto' as const,
             left: 'auto' as const,
             x: '0%',
             width: '100%',
             maxWidth: '100%',
             zIndex: 10,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="font-mono uppercase text-xs tracking-wider group"
      >
        {/* Main Chassis */}
        <div className="bg-zinc-900 border-2 border-zinc-700 p-1 shadow-2xl relative overflow-hidden">
            
            {/* Decorative Corner Screws */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-zinc-600 rounded-full" />
            <div className="absolute top-1 right-1 w-1 h-1 bg-zinc-600 rounded-full" />
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-zinc-600 rounded-full" />
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-zinc-600 rounded-full" />

            {/* Inner Bezel */}
            <div className="border border-zinc-800 bg-zinc-950 p-4 relative">
                
                {/* HUD Header */}
                <div className="flex justify-between items-start mb-4 text-zinc-400 border-b border-zinc-800 pb-2">
                    <div className="flex flex-col">
                        <span className="text-[10px]">TARS_AUDIO_MODULE_V1</span>
                        <span className="text-amber-500 font-bold">{sysStatus}</span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <div className="flex gap-1 mb-1">
                             <div className={`w-1 h-1 bg-zinc-600 ${isPlaying ? 'bg-amber-500 animate-pulse' : ''}`} />
                             <div className={`w-1 h-1 bg-zinc-600 ${isPlaying ? 'bg-amber-500 animate-pulse delay-75' : ''}`} />
                             <div className={`w-1 h-1 bg-zinc-600 ${isPlaying ? 'bg-amber-500 animate-pulse delay-150' : ''}`} />
                        </div>
                        <span className="tabular-nums opacity-60">DAT: {dataStream}</span>
                    </div>
                </div>

                {/* Main Controls Area */}
                <div className="flex items-center gap-4">
                    
                    {/* Play Button (Mechanical Style) */}
                    <button
                        onClick={togglePlay}
                        aria-label={isPlaying ? "Pause audio" : "Play audio"}
                        className="w-12 h-12 bg-zinc-800 border border-zinc-600 hover:bg-zinc-700 hover:border-amber-500/50 active:translate-y-px transition-all flex items-center justify-center shrink-0 group/btn focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
                    >
                        <AnimatePresence mode="wait">
                            {isPlaying ? (
                                <Pause className="w-5 h-5 text-amber-500 fill-current" />
                            ) : (
                                <Play className="w-5 h-5 text-zinc-400 group-hover/btn:text-amber-500 fill-current" />
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Info & Visualization */}
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-baseline mb-1">
                            <h4 className="text-white truncate max-w-[150px] md:max-w-xs">{title}</h4>
                            <span className="text-amber-500 tabular-nums">
                                {formatTime(progress)}<span className="text-zinc-600 px-1">/</span>{formatTime(duration)}
                            </span>
                        </div>

                        {/* Histogram Waveform - Animated TARS Style */}
                        <div className="relative h-6 flex items-end gap-[2px] bg-zinc-900 border-t border-zinc-800 pt-1">
                            {Array.from({ length: 50 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-1 bg-zinc-700"
                                    style={{ 
                                        backgroundColor: i / 50 > progress / (duration || 1) ? '#3f3f46' : '#f59e0b', // zinc-700 vs amber-500
                                        borderRadius: '1px 1px 0 0'
                                    }}
                                    animate={{
                                        height: isPlaying ? [
                                            `${10 + Math.random() * 40}%`,
                                            `${20 + Math.random() * 80}%`,
                                            `${10 + Math.random() * 40}%`
                                        ] : '20%',
                                    }}
                                    transition={{
                                        duration: 0.2, // Fast, twitchy mechanical movement
                                        repeat: Infinity,
                                        repeatType: 'reverse' as const,
                                        delay: i * 0.02,
                                        ease: "linear"
                                    }}
                                />
                            ))}
                            {/* Seek Input */}
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={progress}
                                onChange={handleSeek}
                                aria-label="Seek slider"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
                            />
                        </div>
                    </div>

                     {/* Volume (Toggle Switch Style) */}
                    <button
                        onClick={toggleMute}
                        aria-label={isMuted ? "Unmute" : "Mute"}
                        className={`h-12 w-8 border border-zinc-600 flex flex-col items-center justify-center gap-1 hover:border-amber-500/30 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 outline-none
                            ${isMuted ? 'bg-red-900/20' : 'bg-zinc-900'}
                        `}
                    >
                         <div className={`w-1 h-3 rounded-sm ${isMuted ? 'bg-zinc-700' : 'bg-amber-500'}`} />
                         {isMuted ? <VolumeX className="w-3 h-3 text-red-500" /> : <Volume2 className="w-3 h-3 text-zinc-500" />}
                    </button>

                </div>
            </div>
            
            {/* Bottom Status Bar */}
            <div className="mt-1 flex justify-between px-1 text-[9px] text-zinc-600">
                <span>SECURE_CONN_EST</span>
                <span>PWR: 98%</span>
            </div>
        </div>
      </motion.div>
    </>
  );
}
