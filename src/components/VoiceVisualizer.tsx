import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';

interface VoiceVisualizerProps {
  isRecording: boolean;
  audioData?: number[];
}

export const VoiceVisualizer = ({ isRecording }: VoiceVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0));

  useEffect(() => {
    if (isRecording) {
      startVisualization();
    } else {
      stopVisualization();
    }

    return () => stopVisualization();
  }, [isRecording]);

  const startVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.smoothingTimeConstant = 0.8;
      analyserRef.current.fftSize = 512;
      
      microphoneRef.current.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioData = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          setAudioData(new Uint8Array(dataArray));
        }
        animationRef.current = requestAnimationFrame(updateAudioData);
      };
      
      updateAudioData();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (analyserRef.current) {
      analyserRef.current = null;
    }
    
    setAudioData(new Uint8Array(0));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (audioData.length === 0) return;

    // Get computed primary color and convert to canvas-compatible format
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue('--primary').trim();
    // Convert space-separated HSL to comma-separated for canvas compatibility
    const primaryHsl = `hsl(${primaryColor.replace(/\s+/g, ', ')})`;
    const primaryHsla08 = `hsla(${primaryColor.replace(/\s+/g, ', ')}, 0.8)`;
    const primaryHsla03 = `hsla(${primaryColor.replace(/\s+/g, ', ')}, 0.3)`;

    // Draw visualization
    const barWidth = canvas.width / audioData.length;
    let x = 0;

    // Create gradient with resolved colors
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, primaryHsl);
    gradient.addColorStop(0.5, primaryHsla08);
    gradient.addColorStop(1, primaryHsla03);

    ctx.fillStyle = gradient;

    for (let i = 0; i < audioData.length; i++) {
      const barHeight = (audioData[i] / 255) * canvas.height;
      
      // Draw bar from center
      const y = (canvas.height - barHeight) / 2;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
      
      x += barWidth;
    }

    // Add glow effect
    ctx.shadowColor = primaryHsl;
    ctx.shadowBlur = 10;
    ctx.globalCompositeOperation = 'source-over';
  }, [audioData]);

  if (!isRecording) return null;

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-primary">Recording...</span>
        </div>
        <p className="text-xs text-muted-foreground">Speak clearly into your microphone</p>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-16 rounded-md bg-background/50"
        style={{ minHeight: '64px' }}
      />
      
      {/* Animated bars fallback for when no audio data */}
      {audioData.length === 0 && (
        <div className="flex items-center justify-center h-16 gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-2 bg-primary rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 40 + 10}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};