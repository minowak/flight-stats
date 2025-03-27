import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PropsWithChildren } from "react"

type Props = {
  title: string
  value?: string | number
} & PropsWithChildren

export const StatsCard: React.FC<Props> = ({ title, value, children }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-xs">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {value && <div className="text-3xl">{value}</div>}
        {children}
      </CardContent>
    </Card>
  );
}
