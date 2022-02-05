import { Game } from '@prisma/client';

export function parseGameDetails(detailsData: any) {
  let metaScore: number = (detailsData.metacritic) ? detailsData.metacritic.score : -1;
  let metaUrl: string = (detailsData.metacritic) ? detailsData.metacritic.url : '';

  const game: Game = {
    id: String(detailsData.steam_appid),
    name: String(detailsData.name)
      .replace(/\’/g, '\'')
      .replace(/®/g, '')
      .replace(/™/g, '')
      .replace(/&amp;/g, '&'),
    is_free: detailsData.is_free,
    short_description: detailsData.short_description
      .replace(/&amp;/g, '&'),
    header_image: detailsData.header_image,
    website: detailsData.website || '',
    developers: detailsData.developers,
    publishers: detailsData.publishers,
    windows: detailsData.platforms.windows,
    mac: detailsData.platforms.mac,
    linux: detailsData.platforms.linux,
    metacriticScore: metaScore,
    metacriticUrl: metaUrl,
    background: detailsData.background,
    storeUrl: `https://store.steampowered.com/app/${detailsData.steam_appid}`
  };

  return game;
}
