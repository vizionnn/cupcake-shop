"use client";

import React, { useState } from "react";

interface PhotoOrEmojiProps {
  photoOrEmoji?: string | null;
  name: string;
  className?: string;
  emojiClassName?: string;
}

export function PhotoOrEmoji({
  photoOrEmoji,
  name,
  className = "w-full h-full object-cover",
  emojiClassName = "text-4xl",
}: PhotoOrEmojiProps) {
  const [hasError, setHasError] = useState(false);

  if (!photoOrEmoji || hasError) {
    return <span className={emojiClassName}>🧁</span>;
  }

  const isImage =
    photoOrEmoji.includes(".") ||
    photoOrEmoji.startsWith("http") ||
    photoOrEmoji.startsWith("/") ||
    photoOrEmoji.startsWith("data:");

  if (isImage) {
    let src = photoOrEmoji;
    if (!src.startsWith("http") && !src.startsWith("/") && !src.startsWith("data:")) {
      src = `/${src}`;
    }

    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setHasError(true)}
        className={className}
      />
    );
  }

  return <span className={emojiClassName}>{photoOrEmoji}</span>;
}

