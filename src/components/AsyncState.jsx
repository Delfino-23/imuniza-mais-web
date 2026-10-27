export default function AsyncState({ status, message, onRetry }) {
  const isError = status === "error";
  const isLoading = status === "loading";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={`rounded-xl border px-5 py-8 text-center ${
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-slate-200 bg-white text-slate-600"
      }`}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="mx-auto mb-3 block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-teal-500"
        />
      )}
      <p className="text-sm">{message}</p>
      {isError && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
