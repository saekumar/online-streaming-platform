'use client'

import { Participant, Track } from 'livekit-client'
import { useRef, useState, useEffect } from 'react'
import { useTracks } from '@livekit/components-react'
import { FullscreenControl } from './fullscreen-control'
import { useEventListener } from 'usehooks-ts'
import { VolumeControl } from './volume-control'
interface LiveVideoProps {
  participant: Participant
}
export const LiveVideo = ({ participant }: LiveVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume, setVolume] = useState(0)
  const onVolumeChange = (value: number) => {
    setVolume(+value)
    if (videoRef?.current) {
      videoRef.current.muted = value === 0
      videoRef.current.volume = +value * 0.01
    }
  }
  const toggkeMute = () => {
    const isMuted = volume === 0
    setVolume(isMuted ? 50 : 0)
    if (videoRef?.current) {
      videoRef.current.muted = !isMuted
      videoRef.current.volume = isMuted ? 0.5 : 0
    }
  }
  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen()
    } else if (wrapperRef?.current) {
      wrapperRef.current.requestFullscreen()
    }
  }

  useEffect(() => {
    onVolumeChange(0)
  }, [])

  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = document.fullscreenElement !== null
    setIsFullscreen(isCurrentlyFullscreen)
  }

  useEventListener('fullscreenchange', handleFullscreenChange, wrapperRef)

  useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter((track) => track.participant.identity === participant.identity)
    .forEach((track) => {
      if (videoRef.current) {
        track.publication.track?.attach(videoRef.current)
      }
    })
  return (
    <div className="relative h-full flex" ref={wrapperRef}>
      <video width="100%" ref={videoRef} />
      <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all">
        <div className="absolute bottom-0 flex h-1/4 w-full items-center justify-between bg-gradient-to-tr from-neutral-900 px-4">
          <VolumeControl
            onToggle={toggkeMute}
            value={volume}
            onChange={onVolumeChange}
          />
          <FullscreenControl
            isFullscreen={isFullscreen}
            onToggle={toggleFullscreen}
          />
        </div>
      </div>
    </div>
  )
}
