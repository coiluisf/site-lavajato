export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Site Lavajato</h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema de gestão para lava-jatos
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Login
          </button>
          <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            Saiba Mais
          </button>
        </div>
      </div>
    </main>
  );
}
