import { Check, Minus } from "lucide-react";

interface FeatureMatrixProps {
  features: string[];
}

const ALL_FEATURES = [
  "OCR",
  "RESUME_PARSING",
  "DOCUMENT_CLASSIFICATION",
  "FACE_MATCH",
  "FRAUD_DETECTION",
  "ENTITY_EXTRACTION",
  "TRANSLATION",
  "SUMMARIZATION"
];

export default function FeatureMatrix({ features }: FeatureMatrixProps) {
  const supported = new Set(features);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-lg font-semibold text-white">Supported Features</h3>
      </div>
      <ul className="divide-y divide-slate-800">
        {ALL_FEATURES.map((feature) => (
          <li key={feature} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition">
            <span className="text-sm font-medium text-slate-300">
              {feature.replace(/_/g, " ")}
            </span>
            {supported.has(feature) ? (
              <Check className="h-5 w-5 text-green-400" />
            ) : (
              <Minus className="h-5 w-5 text-slate-600" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
