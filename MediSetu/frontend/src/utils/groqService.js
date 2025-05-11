const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateConsultationSummary(conversationHistory) {
    if (!GROQ_API_KEY) {
        throw new Error('Groq API key is not configured');
    }

    try {
        const prompt = `Based on the following doctor-patient conversation, generate a professional medical consultation summary. Include symptoms, observations, and recommendations:

${conversationHistory.map(msg => `${msg.role === 'doctor' ? 'Doctor' : 'Patient'}: ${msg.text}`).join('\n')}

Please format the summary with the following sections:
1. Symptoms Discussed
2. Doctor's Observations
3. Recommended Actions
4. Additional Notes`;

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a medical assistant helping to generate professional consultation summaries.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate consultation summary');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error generating consultation summary:', error);
        throw error;
    }
} 