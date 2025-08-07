// components/interview/Recorder.tsx
"use client";

import { useState, useRef } from "react";

export default function Recorder({ onComplete }: { onComplete: (audioBlob: Blob) => void }) {
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
      className={`rounded-full px-4 py-2 mt-4 ${recording ? "bg-red-500" : "bg-blue-500"} text-white`}
    >
      {recording ? "녹음 중지" : "녹음 시작"}
    </button>
  );
}
