// Sort options – value backend ke sortBy/sortType me map hota hai.
export const VIDEO_SORT = [
  { value: "createdAt:desc", label: "Newest", sortBy: "createdAt", sortType: "desc" },
  { value: "createdAt:asc", label: "Oldest", sortBy: "createdAt", sortType: "asc" },
  { value: "views:desc", label: "Most viewed", sortBy: "views", sortType: "desc" },
  { value: "views:asc", label: "Least viewed", sortBy: "views", sortType: "asc" },
];

export const DEFAULT_SORT = "createdAt:desc";
