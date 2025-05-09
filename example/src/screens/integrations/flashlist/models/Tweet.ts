import type Author from './Author';

export default interface Tweet {
  id: string;
  author: Author;
  fullText: string;
  retweetCount: number;
  replyCount: number;
  favoriteCount: number;
}
