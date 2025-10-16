"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

function CPFValido(cpf: string): boolean {
  const apenasDigito = cpf.replace(/\D/g, ""); //tira o que não for digito
  if (apenasDigito.length !== 11 || /^(\d)\1{10}$/.test(apenasDigito)) {
    //verifica se todos os digitos são iguais
    return false;
  }

  // Primeiro digito
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(apenasDigito.charAt(i), 10) * (10 - i);
  }
  let resto = soma % 11;
  const primeiroDigito = resto < 2 ? 0 : 11 - resto;
  if (primeiroDigito !== parseInt(apenasDigito.charAt(9), 10)) {
    return false;
  }

  // Segundo dígito
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(apenasDigito.charAt(i), 10) * (11 - i);
  }
  resto = soma % 11;
  const segundoDigito = resto < 2 ? 0 : 11 - resto;
  if (segundoDigito !== parseInt(apenasDigito.charAt(10), 10)) {
    return false;
  }

  return true;
}

const formSchema = z
  .object({
    email: z.string().email("Formato de e-mail inválido."),
    nome: z.string().min(2, "O nome é obrigatório."),
    sobrenome: z.string().min(2, "O sobrenome é obrigatório."),
    diaNascimento: z.string().min(1, "Selecione o dia."),
    mesNascimento: z.string().min(1, "Selecione o mês."),
    anoNascimento: z.string().min(4, "Selecione o ano."),
    cpf: z.string().refine(CPFValido, {
      message: "CPF inválido.",
    }),
    telefone: z
      .string()
      .optional()
      .refine(
        (telefone) => {
          if (!telefone) return true;
          const ApenasNumero = telefone.replace(/\D/g, ""); //tira o que não for numero
          return ApenasNumero.length === 11;
        },
        {
          message: "Telefone Inválido.",
        }
      ),
    senha: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Deve conter uma maiúscula, uma minúscula e um número."
      ),
  })
  .refine(
    (data) => {
      const dia = parseInt(data.diaNascimento, 10);
      const mes = parseInt(data.mesNascimento, 10);
      const ano = parseInt(data.anoNascimento, 10);

      if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
        return true;
      }

      const dataObj = new Date(ano, mes - 1, dia);

      return (
        dataObj.getFullYear() === ano &&
        dataObj.getMonth() === mes - 1 &&
        dataObj.getDate() === dia
      );
    },
    {
      message: "Data de nascimento inválida.",
      path: ["diaNascimento"],
    }
  );

export default function PaginaCadastro() {
  const [carregando, setCarregando] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      nome: "",
      sobrenome: "",
      diaNascimento: "",
      mesNascimento: "",
      anoNascimento: "",
      cpf: "",
      senha: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setMensagemAlerta(null);
    setCarregando(true);
    console.log("Simulando envio dos dados:", values);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setMensagemAlerta({
      type: "success",
      message: "Cadastro concluído com sucesso! Você será redirecionado.",
    });
    setCarregando(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full md:max-w-xl bg-white"
      >
        <Card className="w-full rounded-none border-none shadow-none -mt-8 z-10 bg-w p-4 pt-8 md:rounded-lg md:border md:shadow-md md:mt-0 ">
          <CardHeader>
            <div className="flex items-center justify-center relative">
              <Link
                href="#"
                className="absolute left-0 block md:hidden text-[var(--brand)]"
              >
                <ChevronLeft size={28} />
              </Link>
            </div>
            <CardTitle className="text-xl text-center">
              Crie seu cadastro
            </CardTitle>
            <CardDescription className="text-sm text-center">
              Os campos com <span className="text-[var(--brand)]">*</span> são
              de preenchimento obrigatórios e essenciais para seu cadastro
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="min-h-[88px]">
                  <FormLabel>
                    Email <span className="text-[var(--brand)]">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email.do.usuario@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome <span className="text-[var(--brand)]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="usuário" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sobrenome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Sobrenome <span className="text-[var(--brand)]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="sobrenome" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>
                Data de Nascimento{" "}
                <span className="text-[var(--brand)]">*</span>
              </FormLabel>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <FormField
                  control={form.control}
                  name="diaNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="DD" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={String(i + 1).padStart(2, "0")}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mesNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={String(i + 1).padStart(2, "0")}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="anoNascimento"
                  render={({ field }) => {
                    const currentYear = new Date().getFullYear();
                    const years = Array.from(
                      { length: 100 },
                      (_, i) => currentYear - i
                    );

                    return (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={String(year)}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      CPF <span className="text-[var(--brand)]">*</span>
                    </FormLabel>
                    <FormControl>
                      <IMaskInput
                        mask="000.000.000-00"
                        value={field.value}
                        onAccept={(value: any) => field.onChange(value)}
                        placeholder="000.000.000-00"
                        className={cn(
                          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-9 w-full min-w-0 rounded-md border border-ring bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                          "focus-visible:border-black focus-visible:ring-[0.3px]",
                          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                        )}
                      ></IMaskInput>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <IMaskInput
                        mask="(00) 00000-0000"
                        value={field.value}
                        onAccept={(value: any) => field.onChange(value)}
                        placeholder="(XX) XXXXX-XXXX"
                        className={cn(
                          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-9 w-full min-w-0 rounded-md border border-ring bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                          "focus-visible:border-black focus-visible:ring-[0.3px]",
                          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Senha <span className="text-[var(--brand)]">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={mostrarSenha ? "text" : "password"}
                        placeholder="Mínimo de 6 caracteres"
                        {...field}
                        className="pr-10"
                      />
                    </FormControl>

                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardDescription className="text-xs">
              Ao preencher o formulário acima você concorda com os nossos{" "}
              <Link href="#" className="underline text-[var(--brand)]">
                Termos de uso
              </Link>{" "}
              e nossa{" "}
              <Link href="#" className="underline text-[var(--brand)]">
                Politica de Privacidade.
              </Link>
            </CardDescription>

            <Button
              type="submit"
              className="w-full bg-[var(--brand)] text-[var(--brand)]-foreground hover:bg-[var(--brand)]/90 disabled={!form.formState.isValid || isLoading}"
            >
              {carregando ? "Carregando..." : "Continuar"}
            </Button>
          </CardContent>

          <CardFooter className="pb-5 pt-1  flex justify-center">
            <div className="h-[1.5px] w-md bg-gray-200 " />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
