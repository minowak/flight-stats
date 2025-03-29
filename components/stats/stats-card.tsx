import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JSX, PropsWithChildren } from "react"

type Props = {
  title: string
  icon?: JSX.Element
  value?: string | number
} & PropsWithChildren

export const StatsCard: React.FC<Props> = ({ title, icon, value, children }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-xs flex gap-4 items-center">
          {icon ? <>{icon}</> : ""}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {value && <div className="text-3xl">{value}</div>}
        {children}
      </CardContent>
    </Card>
  );
}
