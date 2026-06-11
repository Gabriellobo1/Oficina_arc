"use client";

import { useState, useEffect, useMemo } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";

interface AvaliacaoAPI {
  id: string;
  nota: number;
  comentario: string | null;
  criadoEm: string;
  veiculo_placa: string;
  veiculo_marca: string;
  veiculo_modelo: string;
  cliente_nome: string;
}

function Stars({ nota }: { nota: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < nota
              ? "h-4 w-4 fill-amber-400 text-amber-400"
              : "h-4 w-4 text-muted-foreground/30"
          }
        />
      ))}
    </div>
  );
}

export function AvaliacoesContent() {
  const { getToken } = useAuth();
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<AvaliacaoAPI[]>(API_ENDPOINTS.avaliacoes.list, { token: getToken() })
      .then(setAvaliacoes)
      .catch(() => toast.error("Erro ao carregar avaliações."))
      .finally(() => setIsLoading(false));
  }, [getToken]);

  const media = useMemo(() => {
    if (avaliacoes.length === 0) return 0;
    return (
      avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
    );
  }, [avaliacoes]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10">
            <Star className="h-7 w-7 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nota média geral</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{media.toFixed(1)}</span>
              <Stars nota={Math.round(media)} />
              <span className="text-sm text-muted-foreground">
                ({avaliacoes.length} avaliações)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {avaliacoes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 py-16">
          <Star className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">
            Nenhuma avaliação registrada
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {avaliacoes.map((a) => (
            <Card key={a.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Stars nota={a.nota} />
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.criadoEm).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-2">
                <p className="text-sm italic text-foreground">
                  {a.comentario ? `"${a.comentario}"` : "Sem comentário."}
                </p>
                <div className="mt-auto border-t pt-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{a.cliente_nome}</span> ·{" "}
                  {a.veiculo_marca} {a.veiculo_modelo} ({a.veiculo_placa})
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
