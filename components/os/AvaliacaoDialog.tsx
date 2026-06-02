"use client";

import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAvaliacao } from "@/hooks/use-avaliacao";

interface AvaliacaoDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (nota: number, comentario?: string) => void;
}

const LABELS: Record<number, string> = {
  1: "Muito ruim",
  2: "Ruim",
  3: "Regular",
  4: "Bom",
  5: "Excelente",
};

export function AvaliacaoDialog({
  orderId,
  open,
  onOpenChange,
  onSuccess,
}: AvaliacaoDialogProps) {
  const { form, isSubmitting, notaAtual, hoverNota, setHoverNota, onSubmit } =
    useAvaliacao({
      orderId,
      onSuccess,
      onClose: () => onOpenChange(false),
    });

  const displayNota = hoverNota || notaAtual;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Avaliar Atendimento
          </DialogTitle>
          <DialogDescription>
            Dê uma nota de 1 a 5 estrelas para o serviço realizado. Sua
            avaliação ajuda a melhorar nosso atendimento.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Seleção de estrelas */}
            <FormField
              control={form.control}
              name="nota"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center gap-3">
                  <FormLabel className="text-sm font-medium">
                    Sua nota
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="flex items-center gap-1"
                        role="group"
                        aria-label="Selecione a nota"
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            id={`star-${star}`}
                            type="button"
                            onClick={() => field.onChange(star)}
                            onMouseEnter={() => setHoverNota(star)}
                            onMouseLeave={() => setHoverNota(0)}
                            className="transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                            aria-label={`${star} estrela${star !== 1 ? "s" : ""}`}
                          >
                            <Star
                              className={`h-10 w-10 transition-colors ${
                                star <= displayNota
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-transparent text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {displayNota > 0 && (
                        <span className="text-sm font-medium text-amber-400">
                          {LABELS[displayNota]}
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comentário */}
            <FormField
              control={form.control}
              name="comentario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Comentário{" "}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="avaliacao-comentario"
                      placeholder="Descreva sua experiência com o serviço..."
                      className="resize-none"
                      rows={4}
                      maxLength={500}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-end">
                    <span className="text-xs text-muted-foreground">
                      {field.value?.length ?? 0}/500
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                id="avaliacao-cancel-btn"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                id="avaliacao-submit-btn"
                type="submit"
                disabled={isSubmitting || notaAtual === 0}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
