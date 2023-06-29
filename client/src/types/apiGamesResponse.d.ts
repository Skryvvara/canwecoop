export type ApiGamesResponse = {
  games: Game[];
  meta: {
    page: number;
    size: number;
    lastPage: number;
    total: number;
  };
};
