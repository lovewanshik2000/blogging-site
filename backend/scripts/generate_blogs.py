#!/usr/bin/env python3
"""
Automated blog generation script using LangChain and a free LLM (GPT4All or HuggingFaceHub).
- Generates N previews per category and posts them to /api/preview-blogs/
- Assigns a random picsum photo as the image.

Usage examples:
  python scripts/generate_blogs.py --api http://127.0.0.1:8000/api --per-category 10

LLM options (auto-detected):
- GPT4All (no internet, requires local model file). Set MODEL_PATH or leave default.
- HuggingFaceHub (requires HUGGINGFACEHUB_API_TOKEN env variable).
If neither is available, the script will fallback to a simple templated generator so it always works.
"""
import argparse
import os
import random
import sys
import time
from typing import List, Dict, Any

import requests

# Try to import LangChain LLMs
LLM_AVAILABLE = False
llm = None

try:
    # GPT4All local model
    from langchain_community.llms import GPT4All  # type: ignore
    model_path = os.environ.get("MODEL_PATH") or os.path.expanduser("~/.cache/gpt4all/mistral-7b-instruct-v0.1.gguf")
    if os.path.exists(model_path):
        llm = GPT4All(model=model_path, max_tokens=512, temp=0.8)
        LLM_AVAILABLE = True
except Exception:
    pass

if not LLM_AVAILABLE:
    try:
        # HuggingFaceHub remote inference
        from langchain_community.llms import HuggingFaceHub  # type: ignore
        hf_token = os.environ.get("HUGGINGFACEHUB_API_TOKEN")
        if hf_token:
            # Choose a free instruct model; adjust as needed
            llm = HuggingFaceHub(
                repo_id="mistralai/Mistral-7B-Instruct-v0.2",
                huggingfacehub_api_token=hf_token,
                model_kwargs={"temperature": 0.8, "max_new_tokens": 512}
            )
            LLM_AVAILABLE = True
    except Exception:
        pass


def gen_with_llm(category: str) -> Dict[str, str]:
    prompt = f"""
    You are a helpful blog writer. Write a high-quality blog post for the category: {category}.
    - Title: 8-12 words, engaging, no quotes
    - Body: 6-10 paragraphs, informative, include bullet points where helpful, no markdown headers
    - Keep it original and readable.
    Return output as:
    TITLE: <title line>
    BODY:\n<paragraphs>
    """.strip()
    try:
        text = llm.invoke(prompt)  # type: ignore
    except Exception:
        # As a fallback with LLM present
        text = "TITLE: {} Insights for Today\nBODY:\n{}".format(
            f"{category} Trends",
            "\n\n".join([
                "Paragraph {} about {}.".format(i + 1, category) for i in range(8)
            ])
        )
    title = "Generated Blog"
    body = text
    # Parse very simply
    if "TITLE:" in text and "BODY:" in text:
        parts = text.split("TITLE:", 1)[1].split("BODY:", 1)
        if len(parts) == 2:
            title = parts[0].strip().replace("\n", " ")[:200]
            body = parts[1].strip()
    return {"title": title, "body": body}


def gen_without_llm(category: str) -> Dict[str, str]:
    # Template generator to ensure script can run without LLM
    title = f"{category} Trends and Tips for {time.strftime('%B %Y')}"
    paragraphs = [
        f"This article explores recent developments in {category}.",
        f"We discuss key insights every {category.lower()} enthusiast should know.",
        "Practical advice is provided with simple examples.",
        "Consider these points:",
        "- Point A: actionable takeaway\n- Point B: common pitfall\n- Point C: resources to learn more",
        "In conclusion, staying curious and hands-on accelerates learning.",
    ]
    return {"title": title[:200], "body": "\n\n".join(paragraphs)}


def generate_for_category(api_base: str, category: Dict[str, Any], n: int) -> int:
    created = 0
    for i in range(n):
        if LLM_AVAILABLE:
            data = gen_with_llm(category.get("name") or "General")
        else:
            data = gen_without_llm(category.get("name") or "General")
        payload = {
            "title": data["title"],
            "body": data["body"],
            "category": category.get("id"),
            "image": f"https://picsum.photos/seed/{random.randint(1, 10**9)}/800/400",
        }
        resp = requests.post(f"{api_base}/preview-blogs/", json=payload, timeout=60)
        if resp.status_code in (200, 201):
            created += 1
        else:
            print(f"Failed to create preview ({resp.status_code}): {resp.text}")
    return created


def main():
    parser = argparse.ArgumentParser(description="Generate preview blogs via LangChain and a free LLM")
    parser.add_argument("--api", default="http://127.0.0.1:8000/api", help="API base URL")
    parser.add_argument("--per-category", type=int, default=5, help="Number of previews per category")
    args = parser.parse_args()

    api_base = args.api.rstrip("/")

    # Get categories
    r = requests.get(f"{api_base}/categories/", timeout=30)
    r.raise_for_status()
    cats = r.json()
    if not isinstance(cats, list):
        cats = cats.get("results", [])
    if not cats:
        print("No categories found; please create categories first.")
        return 1

    total = 0
    for cat in cats:
        print(f"Generating for category: {cat.get('name')}")
        total += generate_for_category(api_base, cat, args.per_category)

    print(f"Created {total} preview blogs.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
