import json
from services.llm_service import ask_llm
from services.graph_service import compute_stats
from services.summary_service import generate_summary
from agents.qa_agent import answer_question

def classify_intent(user_input: str) -> str:
    prompt = f"""
Analyze the following user input and determine what action they want to perform on a codebase.
Categorize it into EXACTLY ONE of the following tags:

- "stats": If the user is asking for statistics, file counts, function counts, or the largest files.
- "graph": If the user is asking for a graph, structure, or visual layout of the code.
- "summary": If the user wants a high-level summary, overview, or explanation of the entire repository's purpose.
- "qa": If the user is asking a specific question about how a feature works, where something is implemented, or a bug.
- "unknown": If the input doesn't fit any of these categories or is gibberish.

Respond ONLY with the EXACT JSON format: {{"intent": "tag"}}
Do not include json markdown code blocks or any other text.

User Input: "{user_input}"
"""
    try:
        response = ask_llm(prompt)
        response = response.replace('```json', '').replace('```', '').strip()
        data = json.loads(response)
        intent = data.get("intent", "unknown").lower()
        if intent not in ["stats", "graph", "summary", "qa"]:
            return "unknown"
        return intent
    except Exception as e:
        print(f"Error classifying intent: {e}")
        return "qa"  # Default to QA on failure

def process_request(user_input: str, collection_name: str, functions_data: list = None):
    print(f"\n[Orchestrator] Analyzing intent for user input: '{user_input}'")
    intent = classify_intent(user_input)
    print(f"[Orchestrator] Detected intent -> {intent.upper()}")
    
    if intent == "stats" or intent == "graph":
        if not functions_data:
            return "Unable to generate exact AST statistics because the raw extracted memory cache for this session has dumped (e.g., server restart or accessing historical sector). Please re-ingest the repository using the COMMENCE SCAN button to rebuild the AST graph."
        stats = compute_stats(functions_data)
        return (f"Codebase Statistics:\n"
                f"- Total Compiled Files: {stats['total_files']}\n"
                f"- Total Extracted Functions: {stats['total_functions']}\n"
                f"- Largest File Tracked: {stats.get('largest_file', 'N/A')}")
        
    elif intent == "summary":
        if not functions_data:
            print("[Orchestrator] AST memory missing. Routing to QA Agent as fallback for Summary...")
            return answer_question("Please provide a comprehensive logical summary, overview, and architectural breakdown of this repository.", collection_name=collection_name)
            
        print("[Orchestrator] Routing to Summary Service...")
        return generate_summary(functions_data)
        
    elif intent == "qa":
        print("[Orchestrator] Routing to QA Semantic Search Agent...")
        return answer_question(user_input, collection_name=collection_name)
        
    else:
        return ("I am an AI assistant for this codebase. Try asking me for:\n"
                "- A high level summary ('What does this repo do?')\n"
                "- Codebase Statistics ('How many files are there?')\n"
                "- Specific QA ('How is authentication implemented?')")
