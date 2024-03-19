import { Status } from "../../Constants";

export type Player = {
  rel: string;
  id: string;
  names: {
    international: string;
    japanese: string;
  };
  supporterAnimation: boolean;
  pronouns: string;
  weblink: string;
  "name-style": {
    style: string;
    "color-from": {
      light: string;
      dark: string;
    };
    "color-to": {
      light: string;
      dark: string;
    };
  };
  role: string;
  signup: string;
  location: {
    country: {
      code: string;
      names: {
        international: string;
        japanese: string;
      };
    };
    region: {
      code: string;
      names: {
        international: string;
        japanese: string;
      };
    };
  };
  twitch: {
    uri: string;
  } | null;
  hitbox: any;
  youtube: {
    uri: string;
  } | null;
  twitter: any;
  speedrunslive: any;
  assets: any;
  links: any;
};

export type Run = {
  id: string;
  weblink: string;
  game: string;
  category: Category;
  videos: { links: { uri: string }[] };
  comment: string;
  status: { status: Status };
  players: { data: Player[] };
  date: string;
  submitted: string;
  times: {
    primary: string;
    primary_t: number;
    realtime: string;
    realtime_t: number;
    realtime_noloads: string | null;
    realtime_noloads_t: number;
    ingame: string | null;
    ingame_t: number;
  };
  system: {
    platform: string;
    emulated: boolean;
    region: string | null;
  };
  splits: any;
  values: { [key: string]: string };
};

export type Variable = {
  id: string;
  name: string;
  category: string;
  scope: {
    type: string;
  };
  mandatory: boolean;
  "user-defined": boolean;
  obsoletes: boolean;
  values: {
    values: {
      [key: string]: {
        label: string;
        rules: string;
        flags: { miscellaneous: boolean };
      };
    };
    default: string;
  };
  "is-subcategory": boolean;
};

export type VariableLookup = {
  [key: string]: {
    name: string;
    choices: { [key: string]: string };
  };
};

export type Category = {
  data: {
    id: string;
    name: string;
    weblink: string;
    type: string;
    rules: string;
    players: { type: string; value: number };
    miscellaneous: boolean;
    links: { rel: string; uri: string }[];
  };
};
