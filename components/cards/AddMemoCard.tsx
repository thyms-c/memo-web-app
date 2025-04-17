import { Card, CardBody } from "@heroui/card";
import { FaPlus } from "react-icons/fa6";

interface AddMemoCardProps {
  onClick?: () => void;
}

export default function AddMemoCard({ onClick }: AddMemoCardProps) {
  return (
    <Card className="h-[198px] w-[347px] !cursor-pointer bg-white opacity-70">
      <CardBody className="flex items-center justify-center" onClick={onClick}>
        <FaPlus className="text-black" size={32} />
      </CardBody>
    </Card>
  );
}
