export const memoQueryKeys = {
  all: ["memos"],
  my: (username: string) => [...memoQueryKeys.all, username],
};
