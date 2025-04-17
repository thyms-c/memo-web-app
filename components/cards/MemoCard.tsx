import { Badge } from "@heroui/badge";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

import { Memo } from "@/interfaces/Memo";

interface MemoCardProps {
  memoData: Memo;
  chipColor: string;
  isNew: boolean;
}

export default function MemoCard({
  memoData,
  chipColor,
  isNew,
}: MemoCardProps) {
  return (
    <Badge
      className="top-0 rounded-2xl border-none bg-badge p-2 px-3.5"
      content={<h1 className="text-xs uppercase">new</h1>}
      isInvisible={!isNew}
      size="sm"
    >
      <Card className="h-[198px] w-[347px] bg-white py-5">
        <CardBody className="grid grid-cols-4 flex-row py-0">
          <div className="relative col-span-1 space-y-2.5">
            <h1 className="text-sm font-semibold uppercase text-black text-opacity-50">
              {memoData.title}
            </h1>
            <Chip className={`${chipColor} text-xs uppercase`}>
              {memoData.userType}
            </Chip>
          </div>
          <div className="relative col-span-3 overflow-y-auto pl-5 scrollbar-hide">
            <p className="text-[10px] font-light leading-5 text-black">
              {memoData.content}
            </p>
          </div>
        </CardBody>
      </Card>
    </Badge>
  );
}
