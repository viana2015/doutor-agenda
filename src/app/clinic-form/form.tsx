"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createClinic } from "@/actions/create-clinic";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
export const clinicFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
});
const ClinicForm = () => {
  const form = useForm<z.infer<typeof clinicFormSchema>>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof clinicFormSchema>) {
    try {
      await createClinic(values);
      form.reset();
      toast.success("Clínica criada com sucesso", {
        style: {
          background: "#4ade80",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar clínica", {
        description: "Verifique os dados e tente novamente.",
        style: {
          background: "#f87171",
          color: "#fff",
        },
        position: "top-right",
      });
    }
    redirect("/dashboard");
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default ClinicForm;
