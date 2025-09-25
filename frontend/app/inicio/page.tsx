import CardInicio from "@/components/card-sessao";
import Produtos from "@/components/produtos";

export default function InicioPage() {
  return (
    <main className="flex-1 bg-[#F9FAFB]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <CardInicio />
        <Produtos />
      </div>
    </main>
  );
}