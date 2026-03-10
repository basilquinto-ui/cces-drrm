const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`

export async function describeIncidentPhoto(base64Image, mimeType = 'image/jpeg') {
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inline_data: { mime_type: mimeType, data: base64Image }
            },
            {
              text: `You are a school DRRM (Disaster Risk Reduction and Management) assistant for Camp Crame Elementary School in Quezon City, Philippines.

Analyze this photo and write a clear, factual incident description in 2-3 sentences. Focus on:
- What hazard or damage is visible
- The apparent severity (minor/moderate/severe)
- Any immediate safety concerns

Keep it professional and factual. Do not use bullet points. Write as if filling out an official incident report.`
            }
          ]
        }],
        generationConfig: { maxOutputTokens: 200, temperature: 0.3 }
      })
    })
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null
  } catch (e) {
    console.error('Gemini error:', e)
    return null
  }
}

export async function suggestAlertMessage(hazardType, level) {
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Write a short, clear emergency alert message for Camp Crame Elementary School staff.
Hazard: ${hazardType}
Alert Level: ${level}
Keep it under 2 sentences. Be direct and actionable. No bullet points.`
          }]
        }],
        generationConfig: { maxOutputTokens: 100, temperature: 0.4 }
      })
    })
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null
  } catch {
    return null
  }
}
