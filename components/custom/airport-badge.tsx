import { XIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { JSX } from "react";

type Props = {
  icon: JSX.Element
  value: string
  onRemove: () => void;
}

export const AirportBadge: React.FC<Props> = ({ icon, value, onRemove }) => {
  return (
    <Badge>
      <div className="flex items-center gap-2">
        {icon}
        {value}
        <XIcon className="size-3 cursor-pointer" onClick={onRemove} />
      </div>
    </Badge>
  );
}
