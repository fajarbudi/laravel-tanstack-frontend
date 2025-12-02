export default function LoadingScreen() {
  return (
    <div className="flex flex-col justify-center items-center h-screen p-8">
      <div
        className="
          animate-spin 
          h-16 
          w-16 
          border-4 
          rounded-full 
          
          /* Properti Border Modern */
          border-t-transparent 
          border-b-blue-500  /* Warna 1 */
          border-l-indigo-600 /* Warna 2 */
          border-r-purple-700 /* Warna 3 */
          shadow-lg /* Sedikit bayangan untuk kedalaman */
        "
      ></div>

      <p className="mt-6 text-xl font-medium text-gray-700">
        Sedang memproses data...
      </p>

      <p className="text-sm text-gray-500 mt-1">Mohon tunggu sebentar.</p>
    </div>
  );
}
