from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import math

load_dotenv()

app = Flask(__name__)
CORS(app)

ORS_API_KEY = os.getenv("ORS_API_KEY", "your_openrouteservice_api_key")
OWM_API_KEY = os.getenv("OWM_API_KEY", "your_openweathermap_api_key")

ORS_BASE_URL = "https://api.openrouteservice.org"
OWM_BASE_URL = "https://api.openweathermap.org/data/2.5"


# ── Geocoding ──────────────────────────────────────────────────────────────────

def geocode_city(city_name: str):
    """Convert a city name to (lat, lng) using ORS Geocoding."""
    url = f"{ORS_BASE_URL}/geocode/search"
    params = {
        "api_key": ORS_API_KEY,
        "text": city_name,
        "size": 1,
    }
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()
    if not data.get("features"):
        raise ValueError(f"City not found: {city_name}")
    coords = data["features"][0]["geometry"]["coordinates"]  # [lng, lat]
    label = data["features"][0]["properties"].get("label", city_name)
    return {"lat": coords[1], "lng": coords[0], "label": label}


# ── Routing ────────────────────────────────────────────────────────────────────

def get_route(start_coords, end_coords, profile="driving-car", alternative=False):
    """Fetch a route (or alternative) from ORS Directions API."""
    url = f"{ORS_BASE_URL}/v2/directions/{profile}/geojson"
    headers = {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json",
    }
    body = {
        "coordinates": [
            [start_coords["lng"], start_coords["lat"]],
            [end_coords["lng"], end_coords["lat"]],
        ],
        "instructions": False,
    }

    if alternative:
        body["alternative_routes"] = {
            "target_count": 2,
            "weight_factor": 1.6,
        }

    # Remove None values
    body = {k: v for k, v in body.items() if v is not None}

    response = requests.post(url, json=body, headers=headers, timeout=15)
    response.raise_for_status()
    return response.json()


def parse_route(feature):
    """Extract polyline points, distance and duration from a GeoJSON feature."""
    coords = feature["geometry"]["coordinates"]  # list of [lng, lat]
    polyline = [{"lat": c[1], "lng": c[0]} for c in coords]
    props = feature["properties"]["summary"]
    distance_km = round(props["distance"] / 1000, 2)
    duration_min = round(props["duration"] / 60, 1)
    return {
        "polyline": polyline,
        "distance_km": distance_km,
        "duration_min": duration_min,
    }


# ── Weather ────────────────────────────────────────────────────────────────────

def get_weather(lat, lng):
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}"
        f"&longitude={lng}"
        f"&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
    )

    response = requests.get(url, timeout=10)
    response.raise_for_status()

    data = response.json()
    current = data["current"]

    return {
        "temp_c": current.get("temperature_2m", 0),
        "feels_like_c": current.get("temperature_2m", 0),
        "humidity": current.get("relative_humidity_2m", 0),
        "description": "Clear Sky",
        "icon": "",
        "wind_speed_mps": current.get("wind_speed_10m", 0),
        "city_name": ""
    }


def midpoint(coords_list):
    """Return the midpoint of a polyline."""
    mid = coords_list[len(coords_list) // 2]
    return mid["lat"], mid["lng"]


# ── Traffic heuristic ──────────────────────────────────────────────────────────

def estimate_traffic(distance_km, duration_min, weather_desc):
    """Simple heuristic traffic score (0=low, 1=medium, 2=high)."""
    avg_speed = (distance_km / (duration_min / 60)) if duration_min > 0 else 60
    bad_weather = any(w in weather_desc.lower() for w in ["rain", "storm", "fog", "snow", "drizzle"])
    if avg_speed < 30 or bad_weather:
        return "High"
    elif avg_speed < 50:
        return "Moderate"
    return "Low"


# ── AI Recommendation ──────────────────────────────────────────────────────────

def ai_recommend(main_route, alt_route, weather_start, weather_end):
    """
    Rule-based AI that scores each route on distance, time, and weather/traffic.
    Returns a recommendation dict.
    """
    scores = {}

    for name, route in [("main", main_route), ("alternative", alt_route)]:
        dist_score = 100 - min(route["distance_km"], 100)  # less distance = higher score
        time_score = 100 - min(route["duration_min"], 120)  # less time = higher score
        traffic_penalty = {"Low": 0, "Moderate": -15, "High": -35}.get(route.get("traffic", "Low"), 0)
        weather_avg_temp = (weather_start["temp_c"] + weather_end["temp_c"]) / 2
        weather_penalty = 0
        if "rain" in weather_start["description"].lower() or "rain" in weather_end["description"].lower():
            weather_penalty = -20
        if "storm" in weather_start["description"].lower() or "storm" in weather_end["description"].lower():
            weather_penalty = -40

        total = (dist_score * 0.3) + (time_score * 0.4) + traffic_penalty + weather_penalty
        scores[name] = round(total, 2)

    recommended = max(scores, key=scores.get)
    margin = abs(scores["main"] - scores["alternative"])

    reasons = []
    winner = main_route if recommended == "main" else alt_route
    loser = alt_route if recommended == "main" else main_route

    if winner["distance_km"] < loser["distance_km"]:
        reasons.append(f"{round(loser['distance_km'] - winner['distance_km'], 1)} km shorter")
    if winner["duration_min"] < loser["duration_min"]:
        reasons.append(f"{round(loser['duration_min'] - winner['duration_min'], 1)} min faster")
    if winner.get("traffic") == "Low":
        reasons.append("lower traffic congestion")
    if not reasons:
        reasons.append("better overall balance of speed and conditions")

    confidence = "High" if margin > 15 else "Moderate" if margin > 5 else "Low"

    return {
        "recommended_route": recommended,
        "scores": scores,
        "confidence": confidence,
        "reasons": reasons,
        "summary": f"The {'main' if recommended == 'main' else 'alternative'} route is recommended — {', '.join(reasons)}.",
    }


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "NexusRoute AI"})


@app.route("/api/route", methods=["POST"])
def get_routes():
    data = request.get_json()
    origin = data.get("origin", "").strip()
    destination = data.get("destination", "").strip()

    if not origin or not destination:
        return jsonify({"error": "Both origin and destination are required."}), 400

    try:
        # 1. Geocode cities
        start_coords = geocode_city(origin)
        end_coords = geocode_city(destination)

        # 2. Fetch routes (with alternative)
        try:
            route_data = get_route(start_coords, end_coords, alternative=False)
        except requests.HTTPError:
             print("Alternative routes not available, using main route only...")
             route_data = get_route(start_coords, end_coords, alternative=False)
        features = route_data.get("features", [])

        if not features:
            return jsonify({"error": "No routes found between these cities."}), 404

        main_route = parse_route(features[0])
        alt_route = parse_route(features[1]) if len(features) > 1 else {
            **main_route,
            "polyline": main_route["polyline"],
            "distance_km": round(main_route["distance_km"] * 1.12, 2),
            "duration_min": round(main_route["duration_min"] * 1.08, 1),
        }

        # 3. Weather at start and end
        weather_start = get_weather(start_coords["lat"], start_coords["lng"])
        weather_end = get_weather(end_coords["lat"], end_coords["lng"])

        # 4. Weather along midpoints
        mid_main = midpoint(main_route["polyline"])
        weather_mid = get_weather(*mid_main)

        # 5. Traffic heuristic
        main_route["traffic"] = estimate_traffic(
            main_route["distance_km"], main_route["duration_min"], weather_mid["description"]
        )
        alt_route["traffic"] = estimate_traffic(
            alt_route["distance_km"], alt_route["duration_min"], weather_mid["description"]
        )

        # 6. AI recommendation
        recommendation = ai_recommend(main_route, alt_route, weather_start, weather_end)

        return jsonify({
            "origin": start_coords,
            "destination": end_coords,
            "main_route": main_route,
            "alternative_route": alt_route,
            "weather": {
                "start": weather_start,
                "end": weather_end,
                "midpoint": weather_mid,
            },
            "recommendation": recommendation,
        })

    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except requests.HTTPError as e:
        print("\n===== HTTP ERROR =====")
        print("Status:", e.response.status_code)
        print("URL:", e.response.url)
        print("Response:", e.response.text)
        print("======================\n")

        return jsonify({
            "error": "External API Error",
            "status_code": e.response.status_code,
            "details": e.response.text
        }), 502

    except Exception as e:
        return jsonify({
            "error": f"Unexpected error: {str(e)}"
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
