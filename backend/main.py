import os
from pathlib import Path
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

# .env file ko backend folder se load karna
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path)

app = FastAPI(
    title="TripVibe API",
    description="AI-powered Personalized Travel Planner",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TripRequest(BaseModel):
    destination: str
    budget: float
    travelers: str
    travelStyle: str
    interests: List[str]
    startDate: str
    endDate: str


@app.get("/")
def home():
    return {
        "message": "TripVibe Backend is running!",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/plan-trip")
def plan_trip(trip: TripRequest):
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY missing. Check backend/.env",
        )

    try:
        client = Groq(api_key=api_key)

        prompt = f"""
Create a personalized travel itinerary using these details:

Destination: {trip.destination}
Total budget: {trip.budget}
Number of travelers: {trip.travelers}
Travel style: {trip.travelStyle}
Interests: {", ".join(trip.interests)}
Start date: {trip.startDate}
End date: {trip.endDate}

Requirements:
1. Create a day-by-day itinerary for the travel dates.
2. Suggest morning, afternoon and evening activities.
3. Include destination-specific places matching the interests.
4. Give an estimated expense breakdown and total.
5. Keep suggestions mindful of the total budget and group size.
6. Mention practical local travel and food suggestions.
7. Do not claim prices, opening hours or availability are live-verified.
8. If exact costs are unknown, clearly label them as estimates.
9. Format the response with clear headings and readable bullet points.
10. Respond in simple English.
"""

        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are TripVibe, a helpful travel planning "
                        "assistant. Create practical, budget-conscious "
                        "itineraries. Never claim unverified information "
                        "is current or guaranteed."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_completion_tokens=3000,
        )

        itinerary = completion.choices[0].message.content

        if not itinerary:
            raise HTTPException(
                status_code=502,
                detail="AI returned an empty itinerary.",
            )

        return {
            "message": "AI itinerary generated successfully!",
            "trip": {
                **trip.model_dump(),
                "itinerary": itinerary,
            },
        }

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=502,
            detail=(
                "Groq AI request failed. Check your API key, "
                "model availability and Groq account limits."
            ),
        )
