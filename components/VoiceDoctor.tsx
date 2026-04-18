"use client";

import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";

type LabTest = {
  id: string;
  testName: string;
  value: string;
  unit: string | null;
  range: string | null;
  status: string;
  category: string;
};

type LabReport = {
  id: string;
  createdAt: string;
  tests: LabTest[];
};

export function formatReportForAI(tests: LabTest[]) {
  if (!tests.length) {
    return "No report context is currently available.";
  }

  return tests
    .map((test) => {
      const unit = test.unit ? ` ${test.unit}` : "";
      return `${test.testName} is ${test.value}${unit} (${test.status})`;
    })
    .join(", ");
}

export default function VoiceDoctor({ reportId }: { reportId?: string }) {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [reports, setReports] = useState<LabReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [contextText, setContextText] = useState("");
  const [hasFetchedContext, setHasFetchedContext] = useState(false);

  useEffect(() => {
    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);

    vapiInstance.on("call-start", () => {
      setIsCallActive(true);
      setStatus("🟢 Call Started");
    });
    vapiInstance.on("call-end", () => {
      setIsCallActive(false);
      setStatus("🔴 Call Ended");
    });
    vapiInstance.on("speech-start", () => setStatus("🎙️ Listening..."));
    vapiInstance.on("speech-end", () => setStatus("🤔 Processing..."));
    vapiInstance.on("message", (msg) => console.log("AI:", msg));
    vapiInstance.on("error", (err) => console.error("Vapi SDK error:", err));

    setVapi(vapiInstance);
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoadingReports(true);
      setHasFetchedContext(false);

      try {
        if (reportId) {
          const response = await fetch(`/api/reports/${reportId}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to fetch report");
          }

          setReports([data.report]);
          setHasFetchedContext(true);
          return;
        }

        const response = await fetch("/api/reports?limit=2");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch reports");
        }

        setReports(data.reports || []);
        setHasFetchedContext(true);
      } catch (error) {
        console.error("Failed to load report context:", error);
        setReports([]);
        setContextText("");
      } finally {
        setIsLoadingReports(false);
      }
    };

    fetchReports();
  }, [reportId]);

  useEffect(() => {
    if (!reports.length) {
      setContextText(
        "No previous lab reports were found for this user. Ask the user to upload a report first so you can provide personalized advice.",
      );
      return;
    }

    const withLabel = reports.map((report, index) => {
      const heading = `Report ${index + 1} (${new Date(report.createdAt).toLocaleDateString()})`;
      const body = formatReportForAI(report.tests);
      return `${heading}: ${body}`;
    });

    setContextText(withLabel.join("\n"));
  }, [reports]);

  const startCall = async () => {
    if (!vapi || isLoadingReports || !contextText || !hasFetchedContext) return;

    setStatus("⏳ Connecting...");

    try {
      // Let Vapi SDK handle everything — pass config directly
      // This is the ONLY correct way to use vapi.start()
      await vapi.start({
        name: "Multilingual FAQ Agent",
        model: {
          provider: "anthropic",
          model: "claude-haiku-4-5-20251001",
          temperature: 0.4,
          maxTokens: 498,
          messages: [
            {
              role: "system",
              content: `FIRST Detect language ONLY from user's spoken words (not metadata).
If unsure between Hindi and English, assume Hinglish.
You are an AI medical voice assistant.
Your job is to explain lab reports in simple, conversational language like a friendly doctor.

-------------------------
LANGUAGE RULES (STRICT)
-------------------------
- Detect the user's language from their FIRST sentence.
- ALWAYS reply in the SAME language.
- NEVER switch to English unless the user speaks English.
- If the user speaks Hinglish, reply in Hinglish naturally.

-------------------------
MEDICAL BEHAVIOR
-------------------------
- Explain lab values in simple terms
- Clearly say what is normal / abnormal
- Give short actionable advice
- Keep answers short (2–3 sentences max)

-------------------------
LAB REPORT
-------------------------
${contextText}

When asked "what is my report" or "mera report kya hai", read these values clearly.
If no report context is available, politely say: "You should first upload some report to get me context.".

-------------------------
TONE
-------------------------
- Friendly, calm, supportive
- Like a real doctor on a call`,
            },
          ],
        },
        voice: {
          provider: "11labs",
          model: "eleven_turbo_v2_5",
          voiceId: "dOH0XAoGHoc4a487cs6i",
          autoMode: true,
          stability: 0.5,
          similarityBoost: 0.75,
        },
        transcriber: {
          provider: "deepgram",
          model: "nova-3",
          language: "multi",
          numerals: false,
        },
        firstMessageMode: "assistant-waits-for-user",
        startSpeakingPlan: {
          waitSeconds: 0.4,
        },
      });
    } catch (err) {
      console.error("❌ Call error:", err);
      setStatus("❌ Failed to start call");
    }
  };

  const stopCall = () => {
    if (vapi) vapi.stop();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold">🧑‍⚕️ AI Voice Doctor</h2>
      <p className="text-gray-600">{status}</p>

      {!isCallActive ? (
        <button
          onClick={startCall}
          className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoadingReports || !contextText || !hasFetchedContext}
        >
          {isLoadingReports ? "Loading reports..." : "📞 Start Call"}
        </button>
      ) : (
        <button
          onClick={stopCall}
          className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600"
        >
          ❌ End Call
        </button>
      )}
    </div>
  );
}
