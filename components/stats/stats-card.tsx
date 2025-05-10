import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JSX, PropsWithChildren } from "react"
import { Spinner } from "../ui/spinner"
import { Skeleton } from "../ui/skeleton"

type Props = {
  title: string
  icon?: JSX.Element
  value?: string | number
} & PropsWithChildren

export const StatsCard: React.FC<Props> = ({ title, icon, value, children }: Props) => {

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="font-bold text-xs flex gap-4 items-center">
          {icon ? <>{icon}</> : ""}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-w-0">
        {value && <div className="text-3xl">{"" + value}</div>}
        {!value && !children && <div className="space-y-2 text-muted-foreground">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[70%]" />
        </div>}
        {children}
      </CardContent>
    </Card>
  );
}
