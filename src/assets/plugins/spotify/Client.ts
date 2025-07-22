class Client {
    client_id: string;
    client_secret: string;
    access_token: string | null = null;

    constructor(client_id: string, client_secret: string) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.access_token = null;
    }

    private async generateTokenTemp(): Promise<string> {
        const request = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                'client_id': this.client_id,
                'client_secret': this.client_secret
            })
        });

        const response = await request.json();
        if (!response.access_token) {
            return ''
        }

        return response.access_token;
    }

    async getAlbumData(album_id: string): Promise<any> {
        if (!this.access_token) {
            this.access_token = await this.generateTokenTemp();
        }

        const request = await fetch(`https://api.spotify.com/v1/albums/${album_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.access_token}`
            }
        });

        if (request.status === 401) {
            this.access_token = await this.generateTokenTemp();
            return this.getAlbumData(album_id);
        }

        return request.json();
    }

    async getTrackData(track_id: string): Promise<any> {
        if (!this.access_token) {
            this.access_token = await this.generateTokenTemp();
        }

        const request = await fetch(`https://api.spotify.com/v1/tracks/${track_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.access_token}`
            }
        });

        if (request.status === 401) {
            this.access_token = await this.generateTokenTemp();
            return this.getTrackData(track_id);
        }

        return request.json();
    }

    async getAlbumTrackList(album_id: string): Promise<any> {
        if (!this.access_token) {
            this.access_token = await this.generateTokenTemp();
        }
        const limit = 50;
        let offset = 0;
        let allTracks: any[] = [];
        while (true) {
            const url = `https://api.spotify.com/v1/albums/${album_id}/tracks?offset=${offset}&limit=${limit}`;
            const request = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.access_token}`
                }
            });

            if (request.status === 401) {
                this.access_token = await this.generateTokenTemp();
                continue;
            }
            
            if (!request.ok) {
                throw new Error(`Error fetching tracks: ${request.statusText}`);
            }
            
            const data = await request.json();
            allTracks = allTracks.concat(data.items);
            
            if (data.next === null) break;
            offset += limit;
        }
        return { items: allTracks };
    }

    async getArtistData(artist_id: string): Promise<any> {
        if (!this.access_token) {
            this.access_token = await this.generateTokenTemp();
        }

        const request = await fetch(`https://api.spotify.com/v1/artists/${artist_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.access_token}`
            }
        });

        if (request.status === 401) {
            this.access_token = await this.generateTokenTemp();
            return this.getArtistData(artist_id);
        }

        return request.json();
    }

    async getArtistTopTracks(artist_id: string): Promise<any> {
        if (!this.access_token) {
            this.access_token = await this.generateTokenTemp();
        }

        const request = await fetch(`https://api.spotify.com/v1/artists/${artist_id}/top-tracks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.access_token}`
            }
        });

        if (request.status === 401) {
            this.access_token = await this.generateTokenTemp();
            return this.getArtistTopTracks(artist_id);
        }

        return request.json();
    }

    async getArtistAlbums(artist_id: string): Promise<any> {
        if (!this.access_token) {
            this.access_token = await this.generateTokenTemp();
        }

        const request = await fetch(`https://api.spotify.com/v1/artists/${artist_id}/albums?limit=10&offset=0`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.access_token}`
            }
        });

        if (request.status === 401) {
            this.access_token = await this.generateTokenTemp();
            return this.getArtistAlbums(artist_id);
        }

        return request.json();
    }

}


export default Client;