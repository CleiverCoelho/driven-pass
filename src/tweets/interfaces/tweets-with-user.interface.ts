export interface TweetWithUser {
  id: number;
  userId: number;
  tweet: string;
  user: {
    id: number;
    username: string;
    avatar: string;
  };
}