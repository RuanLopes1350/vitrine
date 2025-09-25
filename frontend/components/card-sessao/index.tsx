import { ShoppingBag } from "lucide-react";

export default function CardInicio() {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 mb-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F3E8FF] rounded-xl mb-6 border border-[#E9D5FF]">
          <ShoppingBag className="h-8 w-8 text-[#9333EA]" />
        </div>

        <h1 className="text-3xl font-bold text-[#111827] mb-4">
          Bem-vindo à Vitrine!
        </h1>

        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-[#4B5563] text-lg leading-relaxed">
            A maneira mais fácil de mostrar seus produtos e se conectar com os clientes diretamente pelo WhatsApp.
          </p>
          <p className="text-[#4B5563] text-lg">
            Crie sua loja hoje e comece a vender em minutos!
          </p>
        </div>
      </div>
    </div>
  );
}