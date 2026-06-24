import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function uploadResume(file: File, getToken: () => Promise<string | null>) {
  const token = await getToken();
  const form = new FormData();
  form.append("file", file);
  const res = await axios.post(`${API}/resume/upload`, form, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function startInterview(
  sessionId: string,
  domain: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const res = await axios.post(
    `${API}/interview/start`,
    { session_id: sessionId, domain },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function submitAnswer(
  payload: {
    session_id: string;
    domain: string;
    question: string;
    answer: string;
    history: string[];
  },
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const res = await axios.post(`${API}/interview/answer`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function transcribeAudio(
  blob: Blob,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const form = new FormData();
  form.append("audio", blob, "answer.webm");
  const res = await axios.post(`${API}/voice/transcribe`, form, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getSessions(
  userId: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const res = await axios.get(`${API}/interview/sessions/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}