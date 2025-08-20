// components/interview/Recorder.tsx
"use client";

import { useState, useRef } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";

export default function Recorder({
  onComplete,
}: {
  onComplete: (audioBlob: Blob) => void;
}) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const toggleRecording = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        onComplete(audioBlob); // 전송
      };

      mediaRecorder.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current?.stop();
      setRecording(false);
    }
  };

  return (
    <button
      onClick={toggleRecording}
      className={`mt-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md focus:outline-none ${recording ? "bg-red-500" : "bg-[var(--primary)]"}`}
      aria-label={recording ? "녹음 중지" : "녹음 시작"}
    >
      {recording ? <FaStop /> : <FaMicrophone />}
    </button>
  );
}
