export async function handler(event) {
  const artist = event.queryStringParameters.artist;

  const response = await fetch(
    "https://ws.audioscrobbler.com/2.0/" +
    "?method=artist.gettoptracks" +
    "&artist=" + encodeURIComponent(artist) +
    "&api_key=" + process.env.PUT_YOUR_API_KEY_HERE +
    "&format=json"
  );

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}