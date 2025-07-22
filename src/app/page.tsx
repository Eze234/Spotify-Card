"use client";

import { useState } from "react";
import Image from "next/image";
import SpotifyLogo from "@assets/images/spotify.jpeg";

import "@assets/css/page.css";

export default function Home() {
  const [url, setUrl] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleSubmit = async () => {
    const res = await fetch("/api/get/spotify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (res.ok) {
      setImageSrc(data.buffer ? `data:${data.type};base64,${data.buffer}` : null);
    } else {
      setImageSrc(null);
    }
  };

  return (
    <main className="main">
      <nav className="navbar">
        <div className="navlinks">
          <a href="https://me.ezezzz.xyz" className="navlink">Home</a>
          <a href="/examples" className="navlink">Examples</a>
          <a href="https://github.com/Eze234/Spotify-Card" className="navlink">Github</a>
        </div>
        {imageSrc && (
          <a href={imageSrc}
          download="spotify-card.jpg"
          className="downloadBtn">Descargar Poster!</a>
        )}
        <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer">
          <Image
            src={SpotifyLogo.src}
            alt="Logo"
            width={40}
            height={40}
            className="logo"
          />
        </a>
      </nav>

      <div className="centerContent">
        {imageSrc && (
          <>
            <Image
              src={imageSrc}
              alt="Spotify Card"
              width={500}
              height={650}
              className="spotifyImage"
            />
          </>
        )}
        <input
          type="text"
          placeholder="Spotify URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input"
        />
        <button className="submitBtn" onClick={handleSubmit}>
          Enviar
        </button>
      </div>
    </main>
  );
}
