import Image from "next/image";

export function BarraLateralAutenticacao() {
  return (
    <aside className="hidden md:flex w-full h-full bg-[var(--background-accent)] ml-20 flex-col justify-center items-center ">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex">
          <Image
            src="/logos/comeat-green-sm 1.png"
            alt="Logo do comeat"
            width={70}
            height={70}
            className="rounded-md"
          />
          <div className="flex-col justify-center items-center ml-[1rem]">
            <h1 className="text-4xl text-[var(--color-text-log)] font-semibold ">
              Comeat
            </h1>
            <p className="text-sm text-[var(--color-text-log)]">
              Seu app de feiras
            </p>
          </div>
        </div>

        <Image
          src="/logos/image 3.png"
          alt="Imagem de um homem cadeirante e uma mulher trocando uma caixa"
          width={550}
          height={550}
        />
      </div>
    </aside>
  );
}
