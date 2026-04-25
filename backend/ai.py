import json
from google import genai

def call_gemini(api_key: str, profile, workouts):
    client = genai.Client(api_key=api_key)
    
    avg_duration = 0
    if workouts:
        avg_duration = sum(w.duration for w in workouts) / len(workouts)
    
    workouts_text = "\n".join([f"- {w.activity} ({w.duration} min, {w.intensity} intensity)" for w in workouts[-5:]])
    if not workouts_text:
        workouts_text = "None yet."

    prompt = f"""
User Profile:
- Age: {profile.age}
- Goal: {profile.goal}

Recent Activity:
{workouts_text}

Task:
Suggest next workout, recovery advice, and progression plan.
Format your `recommendation_text` beautifully using Markdown (headers, bullet points, bold text).
Include 1 or 2 relevant workout images in your Markdown using exactly this format (do not use code blocks):
![Workout Image 1](https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80)
![Workout Image 2](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80)
![Workout Image 3](https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80)
![Workout Image 4](https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80)

Constraints:
- Avoid unsafe or extreme recommendations
- No medical advice
- Keep suggestions realistic and gradual
- Do not provide medical advice
- Avoid extreme training recommendations
- Encourage gradual progression

You MUST respond in valid JSON format with the following keys:
- "suggested_duration": integer (minutes)
- "suggested_intensity": string (Low, Medium, High)
- "recommendation_text": string (the actual advice in nicely formatted Markdown)
"""

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        
        # attempt to parse the JSON output
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        result = json.loads(text.strip())
        
        s_duration = result.get("suggested_duration", 0)
        
        # Hard Guardrail: Reject if duration > 2x average
        if workouts and avg_duration > 0 and s_duration > avg_duration * 2:
            return "[GUARDRAIL TRIGGERED: The AI suggested a duration that is too high compared to your recent average. Please take it easy.] " + result.get("recommendation_text", "")
            
        return result.get("recommendation_text", "No recommendation text found.")
    except Exception as e:
        return f"Could not generate a safe recommendation. Please try again. Error: {str(e)}"
