import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { memoQueryKeys } from "./memoQueryKeys";

import { Memo } from "@/interfaces/Memo";
import { accessTokenHeader } from "@/utils/apiUtils";
import axios from "@/utils/axios/axios.config";

const fetchAllMemos = async (token: string) => {
  const { data } = await axios.get<Memo[]>(
    `/v1/memos`,
    accessTokenHeader(token)
  );

  return data;
};

const useAllMemos = (options = {}) => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const token = session?.user?.token;

  return useQuery({
    queryKey: memoQueryKeys.all,
    queryFn: () => fetchAllMemos(token!),
    enabled: isAuthenticated && (options as any).enabled !== false,
    ...options,
  });
};

export default useAllMemos;
