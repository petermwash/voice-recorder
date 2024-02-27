"use client";

import React, { useEffect, useRef, useState } from 'react'

declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

const RecordingView = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingComplete, setRecordingComplete] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");

  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    setIsRecording(true);

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
        const { transcript } = event.results[event.results.length - 1][0];

        setTranscript(transcript);
    }

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
        setRecordingComplete(true);
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);

    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
  };

  const clear = () => {
    setTranscript("")
    setRecordingComplete(false);
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
  }

  useEffect (() => {
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }
  })

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="w-full">
        {(isRecording || transcript) && (
          <div className="w-1/4 m-auto rounded-md border p-4 bg-white">
            <div className="flex-1 flex w-full justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {recordingComplete ? "Recorded" : "Recording"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {recordingComplete
                    ? "Thanks for talking."
                    : "Start speaking..."}
                </p>
              </div>
              {isRecording ? (
                <div className="rounded-full w-4 h-4 bg-red-400 animate-pulse" />
              ): (
                <p 
                  className="rounded-xl cursor-pointer" 
                  onClick={clear}
                  >
                    <svg className='w-5 h-5' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#000000" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>
            </svg>
            </p>
              )}
            </div>

            {transcript && (
              <div className="border rounded-md p-2 h-fullm mt-4">
                <p className="mb-0">{transcript}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center w-full">
          {isRecording ? (
            // Button for stopping recording
            <button
              onClick={handleToggleRecording}
              className="mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-20 h-20 focus:outline-none"
            >
              <svg
                className="h-12 w-12 "
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
          ) : (
            // Button for starting recording
            <button
              onClick={handleToggleRecording}
              className="mt-10 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full w-20 h-20 focus:outline-none"
            >
              <svg
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-white"
              >
                <path
                  fill="currentColor"
                  d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecordingView;
