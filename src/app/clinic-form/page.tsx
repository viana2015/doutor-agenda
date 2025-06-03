import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ClinicForm from "./form";

const ClinicFormPage = () => {
  return (
    <div>
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>
              Adicione sua clínica para começar a usar o sistema.
            </DialogTitle>
            <DialogDescription>
              Preencha o formulário abaixo para adicionar sua clínica.
            </DialogDescription>
            <ClinicForm />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicFormPage;
