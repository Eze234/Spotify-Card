"use client";
import React from 'react';
import Image from 'next/image';
import Card from '@assets/components/preview';
import SpotifyLogo from "@assets/images/spotify.jpeg";
import "@assets/css/preview.css"

// Images
import Album_Card from "@preview/album_card.jpg";
import Artist_Card from "@preview/artist_card.jpg";
import Beta_Track_Card from "@preview/track_card.jpg";

const PreviewPage = () => {
  return (
    <>
      <nav className="navbar">
        <div className="navlinks">
          <a href="https://me.ezezzz.xyz" className="navlink">Home</a>
          <a href="/" className="navlink">Card Generator</a>
          <a href="https://github.com/Eze234/Spotify-Card" className="navlink">Github</a>
        </div>
          <Image
            src={SpotifyLogo}
            alt="Logo"
            width={40}
            height={40}
            className="logo"
          />
      </nav>
      <div className="container">
        <Card
          image={Album_Card.src}
          name="Sueños - Parte uno -"
          link="https://open.spotify.com/album/0v42jREsXGe8vDWyXFN0ZM"
        />
        <Card
          image={Artist_Card.src}
          name="Khea"
          link="https://open.spotify.com/artist/4m6ubhNsdwF4psNf3R8kwR"
        />
        <Card
          image={Beta_Track_Card.src}
          name="Dónde Estás - KHEA"
          link="https://open.spotify.com/track/71nkNlFUY4d9mBvTAyV9ig"
        />
      </div>
    </>
  );
};

export default PreviewPage;
