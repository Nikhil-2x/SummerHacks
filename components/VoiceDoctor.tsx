// "use client";

// import { useEffect, useState } from "react";
// import Vapi from "@vapi-ai/web";

// export default function VoiceDoctor() {
//   const [vapi, setVapi] = useState(null);
//   const [isCallActive, setIsCallActive] = useState(false);
//   const [status, setStatus] = useState("Idle");

//   useEffect(() => {
//     const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);

//     // Events
//     vapiInstance.on("call-start", () => {
//       setIsCallActive(true);
//       setStatus("🟢 Call Started");
//     });

//     vapiInstance.on("call-end", () => {
//       setIsCallActive(false);
//       setStatus("🔴 Call Ended");
//     });

//     vapiInstance.on("speech-start", () => {
//       setStatus("🎙️ Listening...");
//     });

//     vapiInstance.on("speech-end", () => {
//       setStatus("🤔 Processing...");
//     });

//     vapiInstance.on("message", (msg) => {
//       console.log("AI:", msg);
//     });

//     setVapi(vapiInstance);
//   }, []);

//   const startCall = () => {
//     if (!vapi) return;

//     vapi.start({
//       assistant: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,

//       // 🔥 PASS LAB REPORT DATA HERE (DYNAMIC LATER)
//       metadata: {
//         report: "Hemoglobin is low, CRP is high"
//       }
//     });
//   };

//   const stopCall = () => {
//     if (vapi) vapi.stop();
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 p-6 border rounded-2xl shadow-lg">
//       <h2 className="text-xl font-bold">🧑‍⚕️ AI Voice Doctor</h2>

//       <p className="text-gray-600">{status}</p>

//       {!isCallActive ? (
//         <button
//           onClick={startCall}
//           className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600"
//         >
//           📞 Start Call
//         </button>
//       ) : (
//         <button
//           onClick={stopCall}
//           className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600"
//         >
//           ❌ End Call
//         </button>
//       )}
//     </div>
//   );
// }