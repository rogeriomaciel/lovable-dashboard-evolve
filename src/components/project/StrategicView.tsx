import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StrategicViewProps {
  data: any;
}

export function StrategicView({ data }: StrategicViewProps) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center text-muted-foreground">
          Nenhuma estratégia definida para este projeto.
        </CardContent>
      </Card>
    );
  }

  const renderValue = (value: any): React.ReactNode => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-4 space-y-1">
          {value.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground">
              {typeof item === 'string' ? item : renderValue(item)}
            </li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([k, v]) => (
            v && (
              <div key={k} className="text-sm">
                <span className="font-medium text-foreground">{k.replace(/_/g, ' ')}:</span>{" "}
                <span className="text-muted-foreground">{typeof v === 'string' ? v : renderValue(v)}</span>
              </div>
            )
          ))}
        </div>
      );
    }
    return <p className="text-sm text-muted-foreground">{String(value)}</p>;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(data).map(([key, value]) => (
        <Card key={key} className="h-full bg-gradient-to-br from-card to-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-primary">
              {key}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderValue(value)}</CardContent>
        </Card>
      ))}
    </div>
  );
}