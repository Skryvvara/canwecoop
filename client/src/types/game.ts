export type Tag = {
  id: string;
  name: string;
  relevance: number;
};

export type Game = {
  id: string;
  name: string;
  isFree: boolean;
  shortDescription: string;
  headerImageUrl: string;
  website: string;
  categories: Tag[];
  genres: Tag[];
  backgroundImageUrl: string;
  storeUrl: string;
  isHidden: boolean;
};

export type BadGame = {
  id: string;
};

export type PaginationMeta = {
  page?: number;
  size?: number;
  total?: number;
  lastPage?: number;
};
