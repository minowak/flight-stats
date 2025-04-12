import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JSX, PropsWithChildren } from "react"
import { Spinner } from "../ui/spinner"

type Props = {
  title: string
  icon?: JSX.Element
  value?: string | number
  loading?: boolean
} & PropsWithChildren

export const StatsCard: React.FC<Props> = ({ title, icon, value, loading, children }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-xs flex gap-4 items-center">
          {icon ? <>{icon}</> : ""}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <div className="flex justify-center"><Spinner className="size-8" /></div> :
          <>
            {value && <div className="text-3xl">{"" + value}</div>}
            {children}
          </>}
      </CardContent>
    </Card>
  );
}
