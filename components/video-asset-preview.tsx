"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw, AlertCircle, Loader2 } from "lucide-react"

interface VideoAssetPreviewProps {
  src?: string
  poster?: string
  title?: string
  duration?: string
  fileSize?: string
  resolution?: string
  format?: string
  className?: string
  onError?: (error: string) => void
  onLoadStart?: () => void
  onLoadEnd?: () => void
}

export function VideoAssetPreview({
  src,
  poster,
  title = "Video Asset",
  duration,
  fileSize,
  resolution,
  format,
  className = "",
  onError,
  onLoadStart,
  onLoadEnd,
}: VideoAssetPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showControls, setShowControls] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setVideoDuration(video.duration)
    const handleLoadStart = () => {
      setIsLoading(true)
      onLoadStart?.()
    }
    const handleLoadedData = () => {
      setIsLoading(false)
      setHasError(false)
      onLoadEnd?.()
    }
    const handleError = () => {
      setIsLoading(false)
      setHasError(true)
      const errorMsg = "Failed to load video. Please check the file format or network connection."
      setErrorMessage(errorMsg)
      onError?.(errorMsg)
    }
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("durationchange", handleDurationChange)
    video.addEventListener("loadstart", handleLoadStart)
    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("error", handleError)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("durationchange", handleDurationChange)
      video.removeEventListener("loadstart", handleLoadStart)
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("error", handleError)
      video.removeEventListener("ended", handleEnded)
    }
  }, [src, onError, onLoadStart, onLoadEnd])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return

    try {
      if (isPlaying) {
        await video.pause()
        setIsPlaying(false)
      } else {
        await video.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Error toggling video playback:", error)
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newTime = value[0]
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume > 0 ? volume : 0.5
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFullscreen = async () => {
    const container = videoRef.current?.parentElement
    if (!container) return

    try {
      if (isFullscreen) {
        await document.exitFullscreen()
      } else {
        await container.requestFullscreen()
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const resetVideo = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    setCurrentTime(0)
    setIsPlaying(false)
    setHasError(false)
    setErrorMessage("")
  }

  const handleMouseMove = () => {
    setShowControls(true)
    setIsHovering(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isHovering) {
        setShowControls(false)
      }
    }, 3000)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div
          className={`relative bg-black group ${isFullscreen ? "h-screen" : "aspect-video"}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            poster={poster || "/placeholder.svg?height=400&width=600"}
            preload="metadata"
            crossOrigin="anonymous"
          >
            {src && (
              <>
                <source src={src} type="video/mp4" />
                <source src={src} type="video/webm" />
                <source src={src} type="video/ogg" />
              </>
            )}
            Your browser does not support the video tag.
          </video>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Loading video...</p>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
              <div className="text-center text-white max-w-md px-4">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-semibold mb-2">Video Error</h3>
                <p className="text-sm text-gray-300 mb-4">{errorMessage}</p>
                <Button
                  onClick={resetVideo}
                  variant="outline"
                  size="sm"
                  className="text-white border-white bg-transparent"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Play Button Overlay (when paused) */}
          {!isPlaying && !isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={togglePlay}
                size="lg"
                className="rounded-full w-16 h-16 bg-white bg-opacity-90 hover:bg-opacity-100 text-black"
              >
                <Play className="h-8 w-8 ml-1" />
              </Button>
            </div>
          )}

          {/* Controls Overlay */}
          {showControls && !hasError && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <Slider
                  value={[currentTime]}
                  max={videoDuration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-white mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(videoDuration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button onClick={togglePlay} size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <div className="flex items-center space-x-2">
                    <Button onClick={toggleMute} size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <div className="w-20">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.1}
                        onValueChange={handleVolumeChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button onClick={toggleFullscreen} size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Video Info Overlay (top-left) */}
          {showControls && !hasError && (
            <div className="absolute top-4 left-4">
              <div className="bg-black bg-opacity-50 rounded px-2 py-1">
                <p className="text-white text-sm font-medium">{title}</p>
                <div className="flex space-x-2 text-xs text-gray-300">
                  {resolution && (
                    <Badge variant="secondary" className="text-xs">
                      {resolution}
                    </Badge>
                  )}
                  {format && (
                    <Badge variant="secondary" className="text-xs">
                      {format.toUpperCase()}
                    </Badge>
                  )}
                  {fileSize && (
                    <Badge variant="secondary" className="text-xs">
                      {fileSize}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
