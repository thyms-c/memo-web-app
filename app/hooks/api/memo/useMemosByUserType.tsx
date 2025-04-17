import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { memoQueryKeys } from "./memoQueryKeys";

import { Memo } from "@/interfaces/Memo";
import { accessTokenHeader } from "@/utils/apiUtils";
import axios from "@/utils/axios/axios.config";

const fetchMemosByUserType = async (token: string) => {
  const { data } = await axios.get<Memo[]>(
    `/v1/memos/user-type`,
    accessTokenHeader(token)
  );

  return data;
};

const useAllMemos = (options = {}) => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const token = session?.user?.token;
  const username = session?.user?.username;

  return useQuery({
    queryKey: memoQueryKeys.my(username!),
    queryFn: () => fetchMemosByUserType(token!),
    enabled: isAuthenticated && (options as any).enabled !== false,
    ...options,
  });
};

export default useAllMemos;
