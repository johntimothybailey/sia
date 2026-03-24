import pytest
import os
from dotenv import load_dotenv
from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import AnswerRelevancyMetric
from deepeval.models.llms.openai_model import GPTModel
from deepeval.models.llms.gemini_model import GeminiModel

# 1. Resolve environment variables from the monorepo root
# This ensures we pick up .env.local even when running from the package dir.
PKG_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_ENV = os.path.join(PKG_DIR, "..", "..", ".env.local")

if os.path.exists(ROOT_ENV):
    load_dotenv(ROOT_ENV)
load_dotenv() # Fallback for package-local .env

def get_eval_model():
    """Detects available API keys and returns the appropriate DeepEval model."""
    if os.environ.get("OPENAI_API_KEY"):
        return GPTModel(model="gpt-4o-mini")
    
    if os.environ.get("GROQ_API_KEY"):
        # Groq is OpenAI-compatible
        return GPTModel(
            model="llama-3.3-70b-versatile",
            api_key=os.environ.get("GROQ_API_KEY"),
            base_url="https://api.groq.com/openai/v1"
        )
    
    if os.environ.get("GEMINI_API_KEY"):
        return GeminiModel(model_name="gemini-1.5-flash")
    
    return None

def read_file(path):
    with open(path, 'r') as f:
        return f.read()

def test_hook_ascender_relevancy():
    model = get_eval_model()
    if not model:
        pytest.fail("No LLM API key found. Set OPENAI_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY in your .env.local at the root.")

    # Load requirements and references
    # Note: Use absolute paths resolved from the location of this test file
    ref_dir = os.path.join(PKG_DIR, "..", "..", "skills", "hook-ascender", "references", "basic")
    
    skill_instructions = read_file(os.path.join(PKG_DIR, "..", "..", "skills", "hook-ascender", "SKILL.md"))
    source_code = read_file(os.path.join(ref_dir, "before.tsx"))
    actual_output = read_file(os.path.join(ref_dir, "after-component.tsx"))
    
    # 2. Setup the Test Case
    test_case = LLMTestCase(
        input=f"Apply this skill: {skill_instructions} to this code: {source_code}",
        actual_output=actual_output,
        retrieval_context=[skill_instructions]
    )
    
    # 3. Apply Relevancy Metric with the detected model
    metric = AnswerRelevancyMetric(threshold=0.7, model=model)
    assert_test(test_case, [metric])

if __name__ == "__main__":
    pytest.main([__file__])
