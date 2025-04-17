import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Form } from "@heroui/form";
import { Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { UserRole } from "@/enums/UserRole";
import { Counter } from "@/interfaces/Counter";
import { CreateMemoSchema, CreateMemoValue } from "@/interfaces/Memo";

interface CreateMemoCardProps {
  onClickOutside: () => void;
  onSave: (data: CreateMemoValue) => void;
  isLoading: boolean;
  chipColor: string;
  role: UserRole;
  counter: Counter;
  isCounterPending: boolean;
}

export default function CreateMemoCard({
  onClickOutside,
  onSave,
  isLoading,
  chipColor,
  role,
  counter,
  isCounterPending,
}: CreateMemoCardProps) {
  const cardRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMemoValue>({
    resolver: zodResolver(CreateMemoSchema),
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClickOutside?.(); // only call if defined
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickOutside]);

  return (
    <Form ref={cardRef} onSubmit={handleSubmit(onSave)}>
      <Card className="h-[198px] w-[347px] bg-white py-2.5">
        <CardBody className="grid grid-cols-4 py-0 scrollbar-hide">
          <div className="relative col-span-1 flex h-full flex-col justify-between py-2.5">
            <div className="space-y-2.5">
              {isCounterPending ? (
                <Spinner
                  classNames={{ label: "text-foreground mt-4" }}
                  color="default"
                  label="dots"
                  size="sm"
                  variant="dots"
                />
              ) : (
                <h1 className="text-sm font-semibold uppercase text-black text-opacity-50">
                  {counter.name == UserRole.USER
                    ? "MEMO-" + (counter.value + 1)
                    : counter.name + "-" + (counter.value + 1)}
                </h1>
              )}
              <Chip className={`${chipColor} text-xs uppercase`}>{role}</Chip>
            </div>

            <button
              className="text-center text-xs font-semibold uppercase text-[#393937] underline transition"
              disabled={isLoading}
              type="submit"
            >
              SAVE
            </button>
          </div>
          <div className="relative col-span-3 h-full pl-4 light">
            <Textarea
              {...register("content")}
              disableAutosize
              classNames={{
                base: "h-full light",
                inputWrapper: "h-full min-h-full light",
                innerWrapper: "h-full min-h-full light",
                input:
                  "h-full min-h-full light text-[10px] font-light text-black leading-5",
              }}
              hidden={false}
              isInvalid={!!errors.content}
              placeholder="Type something..."
            />
          </div>
        </CardBody>
      </Card>
    </Form>
  );
}
