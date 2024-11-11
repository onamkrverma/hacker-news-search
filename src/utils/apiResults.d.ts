export interface SearchResults {
  exhaustive: Exhaustive;
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  hits: Hit[];
  hitsPerPage: number;
  nbHits: number;
  nbPages: number;
  page: number;
  params: string;
  processingTimeMS: number;
  processingTimingsMS: ProcessingTimingsMS;
  query: string;
  serverTimeMS: number;
}

export interface Exhaustive {
  nbHits: boolean;
  typo: boolean;
}

export interface Hit {
  _highlightResult: HighlightResult;
  _tags: string[];
  author: string;
  children?: number[];
  created_at: Date;
  created_at_i: number;
  num_comments?: number;
  objectID: string;
  points: number;
  story_id?: number;
  story_url?: string;
  story_title?: string;
  title?: string;
  updated_at: Date;
  url?: string;
  story_text?: string;
}

export interface HighlightResult {
  author: Author;
  title?: Author;
  url?: Author;
  story_text?: Author;
}

export interface Author {
  matchLevel: MatchLevel;
  matchedWords: any[];
  value: string;
}

export enum MatchLevel {
  None = "none",
}

export interface ProcessingTimingsMS {
  _request: Request;
  total: number;
}

export interface Request {
  queue: number;
  roundTrip: number;
}

export interface StoryRes {
  author: string;
  children: StoryRes[];
  created_at: Date;
  created_at_i: number;
  id: number;
  options: any[];
  parent_id: number | null;
  points: number | null;
  story_id: number;
  text: null | string;
  title: null | string;
  type: Type;
  url: null | string;
}

export enum Type {
  Comment = "comment",
  Story = "story",
}
