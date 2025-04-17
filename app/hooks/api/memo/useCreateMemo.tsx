import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { counterQueryKeys } from "../counter/counterQueryKeys";

import { memoQueryKeys } from "./memoQueryKeys";

import { UserRole } from "@/enums/UserRole";
import { CreateMemoValue, Memo } from "@/interfaces/Memo";
import { accessTokenHeader } from "@/utils/apiUtils";
import axios from "@/utils/axios/axios.config";

const createMemo = async (token: string, request: CreateMemoValue) => {
  const { data } = await axios.post<Memo>(
    "/v1/memos",
    request,
    accessTokenHeader(token)
  );

  return data;
};

const useCreateMemo = () => {
  const { data: session } = useSession();

  const token = session?.user?.token;
  const username = session?.user?.username;
  const role = session?.user?.role as UserRole;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateMemoValue) => createMemo(token!, request),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: memoQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: memoQueryKeys.my(username!),
      });
      queryClient.invalidateQueries({
        queryKey: counterQueryKeys.role(role),
      });
    },
  });
};

export default useCreateMemo;
