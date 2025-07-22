export async function fetchLyrics(artist: string, title: string): Promise<string | null> {
    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    if (!response.ok) return null;

    const data = await response.json();
    return data.lyrics || null;
}
