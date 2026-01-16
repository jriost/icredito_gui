"use client";

import * as React from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";
import { deleteCard } from "@/lib/services/card-service";
import { CardsList } from "./components/card-list";
import { CardForm } from "./components/card-form";
import type { CreditCardDetail } from "@/lib/definitions";

const queryClient = new QueryClient();

function CardsPageContent() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<CreditCardDetail | null>(null);

  const handleCreate = () => {
    setSelectedCard(null);
    setIsFormOpen(true);
  };

  const handleEdit = (card: CreditCardDetail) => {
    setSelectedCard(card);
    setIsFormOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Tarjetas</CardTitle>
              <CardDescription>
                Administra tus tarjetas de crédito, crea nuevas, edita alias y más.
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <PlusCircle className="mr-2 h-4 w-4" /> Crear Tarjeta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CardsList onEdit={handleEdit} />
        </CardContent>
      </Card>
      <CardForm 
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        card={selectedCard}
      />
    </>
  );
}


export default function CardsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <CardsPageContent />
        </QueryClientProvider>
    )
}