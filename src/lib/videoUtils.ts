export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export function getEmbedUrl(url: string): string | null {
  const ytId = getYouTubeVideoId(url);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`;
  }
  if (url.includes('vimeo.com')) {
    const vimeoId = url.split('/').pop()?.split('?')[0];
    if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;
  }
  return null;
}

export function getVideoThumbnail(url: string): string | null {
  const ytId = getYouTubeVideoId(url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
  }
  return null;
}
