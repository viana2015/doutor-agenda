import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const usuariosTable = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
});

export const clinicasTable = pgTable("clinicas", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  createdAt: timestamp("data_criacao").defaultNow().notNull(),
  updatedAt: timestamp("data_atualizacao")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//  Relação de usuário com a clínica
export const relacionamentoUsuarios = relations(usuariosTable, ({ many }) => ({
  usuariosClinicas: many(relacionamentoUsuariosClinicasTabela),
}));

// Tabela que irá relacionar o usuário com a clínica
export const relacionamentoUsuariosClinicasTabela = pgTable(
  "relacionamento_usuarios_clinicas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    usuarioId: uuid("usuario_id").references(() => usuariosTable.id, {
      onDelete: "cascade",
    }),
    clinicaId: uuid("clinica_id").references(() => clinicasTable.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("data_criacao").defaultNow().notNull(),
    updatedAt: timestamp("data_atualizacao")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
);

// Relação de usuário com a clínica
export const relacionamentoUsuariosClinicas = relations(
  relacionamentoUsuariosClinicasTabela,
  ({ one }) => ({
    usuario: one(usuariosTable, {
      fields: [relacionamentoUsuariosClinicasTabela.usuarioId],
      references: [usuariosTable.id],
    }),
    clinica: one(clinicasTable, {
      fields: [relacionamentoUsuariosClinicasTabela.clinicaId],
      references: [clinicasTable.id],
    }),
  }),
);

// Relação de clínica com medicos, pacientes e agendamentos
export const relacionamentoClinica = relations(clinicasTable, ({ many }) => ({
  medicos: many(medicosTable),
  pacientes: many(pacientesTable),
  agendamentos: many(agendamentosTable),
  // Relação de clínica com usuários
  usuariosClinicas: many(relacionamentoUsuariosClinicasTabela),
}));

export const medicosTable = pgTable("medicos", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicaId: uuid("clinica_id").references(() => clinicasTable.id, {
    onDelete: "cascade",
  }),
  nome: text("nome").notNull(),
  avatarImagemUrl: text("avatar_imagem_url"),
  // 0 - Domingo, 1 - Segunda, 2 - Terça, 3 - Quarta, 4 - Quinta, 5 - Sexta, 6 - Sábado
  disponivelApartirDiaSemana: integer(
    "disponivel_apartir_dia_semana",
  ).notNull(), //1
  disponivelDiaSemana: integer("disponivel_dia_semana").notNull(), //6
  horarioInicio: time("horario_inicio").notNull(),
  horarioFim: time("horario_fim").notNull(),
  crm: text("crm").notNull(),
  especialidade: text("especialidade").notNull(),
  valorEmCentavos: integer("valor_em_centavos").notNull(),
  createdAt: timestamp("data_criacao").defaultNow().notNull(),
  updatedAt: timestamp("data_atualizacao")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const RelacaoMedicos = relations(medicosTable, ({ many, one }) => ({
  clinica: one(clinicasTable, {
    fields: [medicosTable.clinicaId],
    references: [clinicasTable.id],
  }),
  // Relação de medico com agendamentos
  agendamentos: many(agendamentosTable),
}));

export const sexoPacienteEnum = pgEnum("sexo_paciente", [
  "masculino",
  "feminino",
  "outro",
]);

export const pacientesTable = pgTable("pacientes", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicaId: uuid("clinica_id").references(() => clinicasTable.id, {
    onDelete: "cascade",
  }),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  telefone: text("telefone").notNull(),
  dataNascimento: date("data_nascimento"),
  sexo: sexoPacienteEnum("sexo").notNull(),
  createdAt: timestamp("data_criacao").defaultNow().notNull(),
  updatedAt: timestamp("data_atualizacao")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const RelacaoPacientes = relations(pacientesTable, ({ one, many }) => ({
  clinica: one(clinicasTable, {
    fields: [pacientesTable.clinicaId],
    references: [clinicasTable.id],
  }),
  // Relação de paciente com agendamentos
  agendamentos: many(agendamentosTable),
}));

export const agendamentosTable = pgTable("agendamentos", {
  id: uuid("id").primaryKey().defaultRandom(),
  data: timestamp("data").notNull(),
  clinicaId: uuid("clinica_id").references(() => clinicasTable.id, {
    onDelete: "cascade",
  }),
  pacienteId: uuid("paciente_id").references(() => pacientesTable.id, {
    onDelete: "cascade",
  }),
  medicoId: uuid("medico_id").references(() => medicosTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("data_criacao").defaultNow().notNull(),
  updatedAt: timestamp("data_atualizacao")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const RelacaoAgendamentos = relations(agendamentosTable, ({ one }) => ({
  paciente: one(pacientesTable, {
    fields: [agendamentosTable.pacienteId],
    references: [pacientesTable.id],
  }),
  medico: one(medicosTable, {
    fields: [agendamentosTable.medicoId],
    references: [medicosTable.id],
  }),
  clinica: one(clinicasTable, {
    fields: [agendamentosTable.clinicaId],
    references: [clinicasTable.id],
  }),
}));
