import SpotiClient from "@spotify/Client";
import {
    createCanvas,
    loadImage
} from "canvas";

export async function artist(url: string) {
    const Client = new SpotiClient(process.env.CLIENT_ID!, process.env.CLIENT_SECRET!);
    const artist_id = getSpotifyArtistId(url);

    if (!artist_id) {
        return null;
    }

    const artistData = await Client.getArtistData(artist_id);
    const topTracks = await Client.getArtistTopTracks(artist_id);
    const artistAlbums = await Client.getArtistAlbums(artist_id);

    if (!topTracks || !artistData) {
        return null;
    }

    const canvas = createCanvas(1080, 1527);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Artist Image
    const artistImage = await loadImage(artistData.images[0].url);
    ctx.drawImage(artistImage, 50, 50, canvas.width - 50 * 2, 900);

    // Artist code
    try {
        const artistCode = await loadImage(`https://scannables.scdn.co/uri/plain/jpeg/FFFFFF/black/640/${encodeURIComponent(artistData.uri)}`);
        ctx.drawImage(artistCode, 40, 1400, 300, (250 * 250) / 640);
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.log('Error loading artist code:', e.message, e.cause);
        }
    }

    // Labels
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 45px sans-serif';
    ctx.fillText("Top Tracks", 60, 1000);
    ctx.fillText("Albums", 720, 1000);

    // Top tracks
    ctx.fillStyle = '#000000';
    ctx.font = '28px sans-serif';
    topTracks.tracks.map((track: any, index: number) => {
        const column = Math.floor(index / 12);
        const x = 60 + column * 350;
        const y = 1055 + (index % 12) * 35;
        ctx.fillText(`${index + 1}. ${track.name}`, x, y);
    }).join('\n');

    // Albums
    ctx.fillStyle = '#000000';
    ctx.font = '28px sans-serif';
    artistAlbums.items.map((album: any, index: number) => {
        const column = Math.floor(index / 12);
        const x = 720 + column * 350;
        const y = 1055 + (index % 12) * 35;
        ctx.fillText(`${index + 1}. ${album.name}`, x, y);
    }).join('\n');


    // Artist Data
    ctx.font = 'bold 45px sans-serif';
    const artistName = artistData.name;
    let x = 750;
    const w = ctx.measureText(artistName).width;
    if (w > 300) {
        x = 750 - (w - 300);
    }
    ctx.fillText(artistName, x, 1450);
    ctx.font = '28px sans-serif';
    ctx.fillText(`Followers: ${artistData.followers.total}`, 750, 1500);
    ctx.fillText(`Popularity: ${artistData.popularity}`, 750, 1550);
    ctx.fillText(`Genres: ${artistData.genres.join(', ')}`, 750, 1600);

    // Save the image to a buffer
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });

    return buffer.toString('base64');

}

function getSpotifyArtistId(url: string): string | null {
    try {
        const parts = url.split("/");
        const artistIndex = parts.findIndex(part => part === "artist");
        if (artistIndex !== -1 && parts[artistIndex + 1]) {
            const idWithParams = parts[artistIndex + 1];
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