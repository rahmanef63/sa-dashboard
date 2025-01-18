import React from "react";
import { MediaConfigPanel } from "./media/MediaConfigPanel";

interface PostMediaProps {
  onFileSelect: (file: File) => void;
}

export const PostMedia: React.FC<PostMediaProps> = ({ onFileSelect }) => {
  return <MediaConfigPanel onFileSelect={onFileSelect} />;
};