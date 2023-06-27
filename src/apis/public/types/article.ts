export interface ArticleItem {
  aid: number;
  bar: Bar;
  bid: number;
  comment_count: number;
  content: string;
  createTime: string;
  is_liked: boolean;
  is_star: boolean;
  like_count: number;
  photo: string[] | null;
  star_count: number;
  title: string;
  uid: number;
  user: User;
}

export interface Bar {
  bdesc: string;
  bid: number;
  bname: string;
  createTime: string;
  is_followed: boolean;
  photo: string;
  uid: number;
}

export interface User {
  avatar: string;
  createTime: string;
  is_fans: boolean;
  is_followed: boolean;
  uid: number;
  username: string;
}
