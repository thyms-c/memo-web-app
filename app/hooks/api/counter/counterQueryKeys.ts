export const counterQueryKeys = {
  all: ["counter"],
  role: (role: string) => [...counterQueryKeys.all, role],
};
