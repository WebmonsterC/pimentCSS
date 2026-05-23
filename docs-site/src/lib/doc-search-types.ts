export type DocSearchEntry = {
  id: string;
  title: string;
  url: string;
  section: string;
  breadcrumb: string[];
  lead: string;
  keywords: string;
};

export type DocSearchIndex = {
  version: number;
  entries: DocSearchEntry[];
};
