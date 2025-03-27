import { Progress } from "../ui/progress";

type Props = {
  distance: number
}

export const DistanceToTheMoon: React.FC<Props> = ({ distance }: Props) => {
  const toMoon = 363300
  const pct = (distance / toMoon) * 100
  const over = pct / 100

  return (
    <div>
      <div className="flex gap-2 items-baseline">
        <div className="w-full">
          <Progress className="mt-2" value={pct} />
        </div>
        <div className="whitespace-nowrap text-sm">
          x {over.toFixed(0)}
        </div>
      </div>
      <div className="text-center text-xs">{pct.toFixed(2)}%</div>
    </div>
  );
}
