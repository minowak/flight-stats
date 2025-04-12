import { RefreshCwIcon } from "lucide-react";

type Props = {
  className?: string
}

export const Spinner: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <RefreshCwIcon className="animate-spin" />
    </div>
  );
}
