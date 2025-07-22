import SpotiClient from "@spotify/Client";
import {
    createCanvas,
    loadImage
} from "canvas";

export async function album(url: string) {
    const Client = new SpotiClient(process.env.CLIENT_ID!, process.env.CLIENT_SECRET!);

    const album_id = getSpotifyAlbumId(url);

    if (!album_id) {
        return null;
    }

    const albumData = await Client.getAlbumData(album_id);
    const trackList = await Client.getAlbumTrackList(album_id);
    const [year, month, day] = albumData.release_date.split("-");

    if (!trackList || !albumData) {
        return null;
    }

    const canvas = createCanvas(1080, 1527);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Album Cover
    const coverImage = await loadImage(albumData.images[0].url);
    ctx.drawImage(coverImage, 50, 50, canvas.width - 50 * 2, 900);

    // Album code
    try {
        const albumCode = await loadImage(`https://scannables.scdn.co/uri/plain/jpeg/FFFFFF/black/640/${encodeURIComponent(albumData.uri)}`);
        ctx.drawImage(albumCode, 40, 1400, 300, ( 250 * 250 ) / 640); 
    } catch(e: unknown) {
        if (e instanceof Error) {
        console.log('Error loading album code:', e.message, e.cause);
        }
    }

    // Track list
    ctx.fillStyle = '#000000';
    ctx.font = '28px sans-serif';
    trackList.items.map((track: any, index: number) => {
        const column = Math.floor(index / 12);
        const x = 60 + column * 350;
        const y = 1000 + (index % 12) * 35;
        ctx.fillText(`${index + 1}. ${track.name}`, x, y);
    }).join('\n');

    // Album Data
    ctx.font = 'bold 45px sans-serif';
    const albumName = albumData.name;
    let x = 750;
    const w = ctx.measureText(albumName).width;
    if (w > 300) {
        x = 750 - (w - 300);
    }
    ctx.fillText(albumName, x, 1420);

    ctx.font = '30px sans-serif';
    ctx.fillText(`${albumData.artists[0].length > 1 ? albumData.artists.map((x: any) => x.name).join(", ") : albumData.artists[0].name}`, x, 1370);
    ctx.fillText(`${day}/${month}/${year}`, x, 1470);

    // Save Jpg
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });

    return buffer.toString('base64');
}


function getSpotifyAlbumId(url: string): string | null {
    try {
        const parts = url.split("/");
        const albumIndex = parts.findIndex(part => part === "album");
        if (albumIndex !== -1 && parts[albumIndex + 1]) {
            const idWithParams = parts[albumIndex + 1];
            const id = idWithParams.split("?")[0];
            return id;
        } else {
            console.log("Link is invalid.");
            return null;
        }
    } catch (err) {
        console.log("SpotiErr: ", err);
        return null;
    }
}