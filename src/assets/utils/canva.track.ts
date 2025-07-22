import SpotiClient from "@spotify/Client";
import { fetchLyrics } from "@assets/plugins/spotify/lyrics";
import {
    createCanvas,
    loadImage,
    registerFont
} from "canvas";

export async function track(url: string) {
    registerFont("./src/assets/fonts/sans-serif.ttf", { family: 'sans-serif' });
    const Client = new SpotiClient(process.env.CLIENT_ID!, process.env.CLIENT_SECRET!);

    const track_id = getSpotifyTrackId(url);

    if (!track_id) {
        return null;
    }

    const trackData = await Client.getTrackData(track_id);

    if (!trackData) {
        return null;
    }

    const canvas = createCanvas(1080, 1527);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Track Image
    const trackImage = await loadImage(trackData.album.images[0].url);
    ctx.drawImage(trackImage, 50, 50, canvas.width - 50 * 2, 900);

    // Track Name
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 45px sans-serif';
    const trackName = trackData.name;

    let x = 420;
    const w = ctx.measureText(trackName).width;
    if (w > 300) {
        x = 750 - (w - 300);
    }
    ctx.fillText(trackName, x, 1000);

    // track lirycs
    await fetchLyrics(trackData.artists[0].name, trackData.name)
    .then((lyrics) => {
        if (!lyrics) return ctx.fillText("Lyrics not available", 250, 1075);
        const lines = lyrics.split('\n').slice(0, 5);
        ctx.font = '34px sans-serif';
        ctx.fillStyle = 'black';
        lines.forEach((line, i) => {
            ctx.fillText(line, 250, 1075 + i * 55);
        });
    })

    // Track code
    try {
        const trackCode = await loadImage(`https://scannables.scdn.co/uri/plain/jpeg/FFFFFF/black/640/${encodeURIComponent(trackData.uri)}`);
        ctx.drawImage(trackCode, 40, 1400, 300, (250 * 250) / 640);
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.log('Error loading track code:', e.message, e.cause);
        }
    }

    // track data
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 45px sans-serif';
    let x2 = 750;

    const albumName = trackData.album.name;

    const w2 = ctx.measureText(albumName).width;

    if (w2 > 300) {
        x2 = 750 - (w2 - 300);
    }
    ctx.fillText(albumName, x2, 1420);

    ctx.fillStyle = '#000000';
    ctx.font = '25px sans-serif';
    ctx.fillText(`${trackData.artists[0].name}`, x2, 1450)

    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });

    return buffer.toString('base64');
}

function getSpotifyTrackId(url: string): string | null {
    try {
        const parts = url.split("/");
        const trackIndex = parts.findIndex(part => part === "track");
        if (trackIndex !== -1 && parts[trackIndex + 1]) {
            const idWithParams = parts[trackIndex + 1];
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