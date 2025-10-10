import { BarraLateralAutenticacao } from "@/components/layout/BarraLateralAutenticacao";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col md:flex-row min-h-screen w-full m-0 p-0  ">
      <div className="hidden md:flex md:w-1/2">
        <BarraLateralAutenticacao />
      </div>

      <div className="block md:hidden w-full">
        <div className="relative w-full bg-[var(--background-accent)] pt-12 pb-23 px-5 text-center rounded-b-[90px] overflow-hidden">
          <div className="flex flex-row items-center justify-center  pt-10">
            <Image
              src="/logos/comeat-green-sm 1.png"
              alt="Logo do comeat"
              width={50}
              height={50}
              className="rounded-md"
            />
            <div className="ml-2">
              <h1 className="text-3xl text-[#331E1A] font-semibold">Comeat</h1>
              <p className="text-sm text-[#331E1A]">Seu app de feiras</p>
            </div>
          </div>
        </div>
      </div>

      <section className="w-full md:w-1/2 flex justify-center items-start md:items-start py-4 md:p-6">
        <div className="w-full px-2 sm:px-4 md:max-w-md md:mx-auto">
          {children}
        </div>
      </section>
    </main>
  );
}
