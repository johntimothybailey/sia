import os
import sys

# Add the directory containing the test_hook_ascender script so we can reuse get_eval_model
PKG_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(PKG_DIR)

from test_hook_ascender import get_eval_model, read_file

def evaluate_catch_22():
    model = get_eval_model()
    if not model:
        print("Error: No LLM API key found in .env.local.")
        sys.exit(1)
        
    print(f"Using Model: {model.model_name if hasattr(model, 'model_name') else model.model}")
    print("Reading skill instructions and source code...")

    skill_path = os.path.join(PKG_DIR, "..", "..", "skills", "catch-22", "SKILL.md")
    source_path = os.path.join(PKG_DIR, "..", "..", "skills", "catch-22", "references", "count-include-mismatch", "before.ts")
    
    skill_instructions = read_file(skill_path)
    source_code = read_file(source_path)
    
    prompt = f"""
Apply the following skill guidelines to review the provided code snippet.
Return the review exactly as structured by the skill instructions.

<SKILL_INSTRUCTIONS>
{skill_instructions}
</SKILL_INSTRUCTIONS>

<SOURCE_CODE>
{source_code}
</SOURCE_CODE>
"""

    print("Evaluating using LLM... This may take a few seconds.")
    # Assuming the DeepEval model has a generate method
    if hasattr(model, 'generate'):
        response = model.generate(prompt)
    elif hasattr(model, 'a_generate'):
        import asyncio
        response = asyncio.run(model.a_generate(prompt))
    else:
        print("Model object doesn't have a generate method.")
        sys.exit(1)

    print("\n" + "="*50)
    print("CATCH-22 REVIEW OUTPUT")
    print("="*50)
    print(response)
    print("="*50)

if __name__ == "__main__":
    evaluate_catch_22()
