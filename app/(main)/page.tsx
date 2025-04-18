"use client";

import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import useRoleCounter from "../hooks/api/counter/useRoleCounters";
import useAllMemos from "../hooks/api/memo/useAllMemos";
import useCreateMemo from "../hooks/api/memo/useCreateMemo";
import useMemosByUserType from "../hooks/api/memo/useMemosByUserType";

import AddMemoCard from "@/components/cards/AddMemoCard";
import CreateMemoCard from "@/components/cards/CreateMemoCard";
import MemoCard from "@/components/cards/MemoCard";
import { UserRole } from "@/enums/UserRole";
import { CreateMemoValue } from "@/interfaces/Memo";

export default function Home() {
  const { data: session } = useSession();
  const role = session?.user?.role as UserRole;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isAddingMemo, setIsAddingMemo] = useState(false);
  const { isPending: isCreating, mutateAsync } = useCreateMemo();
  const [newestMemoId, setNewestMemoId] = useState<string | null>(null);

  useEffect(() => {
    const savedMemoId = sessionStorage.getItem("newestMemoId");

    if (savedMemoId) {
      setNewestMemoId(savedMemoId);
    }
  }, []);

  const isAdmin = role === UserRole.ADMIN;
  const isUser = role === UserRole.USER;

  const chipColor = isAdmin ? "bg-chip-admin" : "bg-chip-user";

  const {
    data: allMemos,
    isPending: isAllMemosPending,
    error: allMemosError,
  } = useAllMemos({ enabled: isAdmin });

  const {
    data: userMemos,
    isPending: isUserMemosPending,
    error: userMemosError,
  } = useMemosByUserType({ enabled: isUser });

  const memos = isAdmin ? allMemos : userMemos;
  const isFetching = isAdmin ? isAllMemosPending : isUserMemosPending;
  const error = isAdmin ? allMemosError : userMemosError;

  if (error) {
    addToast({
      title: "Error",
      description: "Failed to fetch memos. Please try again.",
      color: "danger",
    });
    console.error("Error fetching memos:", error);
  }

  const {
    data: counter,
    isPending: isCounterPending,
    error: fetchCounterErr,
  } = useRoleCounter();

  if (fetchCounterErr) {
    console.error("Error fetching counter:", fetchCounterErr);
  }

  const handleSaveMemoCard = async (data: CreateMemoValue) => {
    try {
      const mutationPromise = mutateAsync(data);

      addToast({
        title: "Saving Memo",
        description: "Your memo is being saved.",
        promise: mutationPromise,
        color: "success",
      });

      const response = await mutationPromise;

      setNewestMemoId(response.id);
      sessionStorage.setItem("newestMemoId", response.id);

      setIsAddingMemo(false);
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to create memo card. Please try again.",
        color: "danger",
      });
      console.error("Error creating memo card:", error);
    }
  };

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function handleConfirmCancel() {
    onOpenChange();

    delay(200).then(() => {
      setIsAddingMemo(false);
    });
  }

  return (
    <section className="container mx-auto flex max-w-7xl flex-grow flex-col items-center justify-start space-y-12 overflow-y-auto px-6 pb-16 pt-28 scrollbar-hide lg:space-y-20 lg:pt-32">
      <div className="flex items-end space-x-2">
        <h1 className="text-4xl font-bold md:text-6xl lg:text-6xl">
          Memo Cards
        </h1>
        <h1 className="relative mb-0.5 text-2xl lg:text-3xl">
          (
          {isFetching ? "-" : (memos?.length || 0) + (isAddingMemo ? "+1" : "")}
          )
        </h1>
      </div>

      {isFetching ? (
        <Spinner color="default" size="lg" />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {memos?.map((memo) => (
            <MemoCard
              key={memo.id}
              chipColor={
                memo.userType == UserRole.ADMIN
                  ? "bg-chip-admin"
                  : "bg-chip-user"
              }
              isNew={memo.id === newestMemoId}
              memoData={memo}
            />
          ))}
          {isAddingMemo ? (
            <CreateMemoCard
              chipColor={chipColor}
              counter={counter!}
              isCounterPending={isCounterPending}
              isLoading={isCreating}
              role={role}
              onClickOutside={onOpen}
              onSave={handleSaveMemoCard}
            />
          ) : (
            <AddMemoCard onClick={() => setIsAddingMemo(true)} />
          )}
        </div>
      )}

      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cancel Creating Memo?
              </ModalHeader>
              <ModalBody>
                <p className="text-sm font-light">
                  If you cancel now, your memo will not be saved. Are you sure
                  you want to cancel?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Continue Creating
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={handleConfirmCancel}
                >
                  Cancel Creating
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
