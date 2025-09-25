import { ShoppingBag } from "lucide-react";
import ProdutosCard from "./../produto-card";

const produtos = [
  {
    _id: "1",
    titulo: "Algum produto que esteja sendo vendido ai",
    descricao: "Descrição detalhada do produto",
    preco: 89.99,
    foto: "/Image.png",
    usuarioId: "user1"
  },
  {
    _id: "2", 
    titulo: "Algum outro produto que esteja sendo vendido ai 2",
    descricao: "Descrição detalhada do produto",
    preco: 24.99,
    foto: "/Image (1).png",
    usuarioId: "user1"
  },
  {
    _id: "3",
    titulo: "Algum outro produto que esteja sendo vendido ai 3",
    descricao: "Descrição detalhada do produto",
    preco: 29.99,
    foto: "/Image (2).png",
    usuarioId: "user1"
  }
];

export default function Produtos() {
  return (
    <section className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-[#F3E8FF] p-2 rounded-lg border border-[#E9D5FF]">
          <ShoppingBag className="h-5 w-5 text-[#9333EA]" />
        </div>
        <h2 className="text-2xl font-bold text-[#111827]">Produtos</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {produtos.map((produtos) => (
          <ProdutosCard key={produtos._id} produtos={produtos} />
        ))}
      </div>
    </section>
  );
}