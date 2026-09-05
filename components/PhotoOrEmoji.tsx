import React from "react";

interface PhotoOrEmojiProps {
  photoOrEmoji: string;
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
  if (
    photoOrEmoji &&
    (photoOrEmoji.includes(".") || photoOrEmoji.startsWith("http"))
  ) {
    return (
      <img
        src={photoOrEmoji}
        alt={name}
        loading="lazy"
        className={className}
      />
    );
  }

  return <span className={emojiClassName}>{photoOrEmoji || "🧁"}</span>;
}
