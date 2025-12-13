export function getVideoEmbedUrl(url: string): string | null {
    if (!url) return null;

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Check for direct video file (mp4, webm, ogg)
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
        return url; // Return as is for <video> tag
    }

    return null;
}

export function isVideoUrl(url: string): boolean {
    return !!getVideoEmbedUrl(url);
}
