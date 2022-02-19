export type NotesParamList = {
  Library: undefined;
  EditScreen: { slug?: string };
};

export type MoreParamList = {
  Settings: undefined;
  About: undefined;
  Feedback: undefined;
};

export type Note = {
  created: string;
  modified: string;
} & NoteDraft;

export type NoteDraft = {
  slug: string;
  name: string;
  content: string;
  columns: number;
};

export enum InfoAlert {
  ON_SAVE,
}
