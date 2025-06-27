import TokenInteraction from "@/components/TokenInteraction";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Simple Token DApp
        </h1>
        <p className="text-center text-gray-600">
          Interact with the Simple Token (SIMP) on Sepolia Testnet
        </p>
        <TokenInteraction />
      </div>
    </main>
  );
}
