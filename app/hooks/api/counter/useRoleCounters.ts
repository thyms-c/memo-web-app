import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { counterQueryKeys } from "./counterQueryKeys";

import { Counter } from "@/interfaces/Counter";
import { accessTokenHeader } from "@/utils/apiUtils";
import axios from "@/utils/axios/axios.config";

const fetchRoleCounter = async (token: string) => {
  const { data } = await axios.get<Counter>(
    `/v1/counters/user-type`,
    accessTokenHeader(token)
  );

  return data;
};

const useRoleCounter = (options = {}) => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const token = session?.user?.token;
  const role = session?.user?.role;

  return useQuery({
    queryKey: counterQueryKeys.role(role!),
    queryFn: () => fetchRoleCounter(token!),
    enabled: isAuthenticated && (options as any).enabled !== false,
    ...options,
  });
};

export default useRoleCounter;
