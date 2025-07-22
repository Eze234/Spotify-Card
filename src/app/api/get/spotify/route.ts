import { album } from "@assets/utils/canva.album";
import { artist } from "@assets/utils/canva.artist";
import { track } from "@assets/utils/canva.track";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { url } = await request.json();
    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let buffer;

    try {
        if (url.includes("/album")) {
            buffer = await album(url);
        } else if (url.includes("/artist")) {
            buffer = await artist(url);
        } else if (url.includes("/track")) {
            buffer = await track(url);
        }


        if (!buffer) {
            return NextResponse.json({ error: "Failed to generate album image" }, { status: 500 });
        }

        return NextResponse.json({ buffer: buffer, type: 'image/jpg' });
    } catch(e: unknown) {
        if (e instanceof Error) {
            console.log(e)
            return NextResponse.json({ error: e.message }, { status: 500, statusText: e.message });
        }
    }
}