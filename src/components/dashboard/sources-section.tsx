const sources = [
  { date: "July 2024", active: true },
  { date: "May 2022", active: false },
];

export function SourcesSection() {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-purple-400 mb-4">Sources</h3>
      <div className="space-y-2">
        {sources.map((source) => (
          <div
            key={source.date}
            className={`rounded-md p-3 text-white cursor-pointer transition-colors ${
              source.active ? "bg-purple-700" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {source.date}
          </div>
        ))}
      </div>
    </div>
  );
}
