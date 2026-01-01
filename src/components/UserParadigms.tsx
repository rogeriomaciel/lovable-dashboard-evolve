import { Paradigma } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sparkles, ArrowRight } from "lucide-react";

interface UserParadigmsProps {
  paradigmas: Paradigma[];
}

export function UserParadigms({ paradigmas }: UserParadigmsProps) {
  if (!paradigmas || paradigmas.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Meus Paradigmas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhum paradigma registrado ainda. Converse com o CORE para descobrir os seus!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Meus Paradigmas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 px-6 pb-4">
            {paradigmas.map((paradigma, index) => (
              <Card
                key={index}
                className="min-w-[320px] max-w-[320px] shrink-0 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
              >
                <Accordion type="single" collapsible>
                  <AccordionItem value={`paradigma-${index}`} className="border-none">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex flex-col items-start gap-2 text-left">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="line-through">{paradigma.paradigma_antigo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                          <span className="font-semibold text-sm text-primary whitespace-normal">
                            {paradigma.novo_paradigma}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground whitespace-normal">
                        {paradigma.paradigma_detalhe}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
