import asyncio
import logging
import os
import random
import xml.etree.ElementTree as ET
from tempfile import NamedTemporaryFile
from typing import Optional

import aiohttp
from yarl import URL

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

ARXIV_AI_QUERY_URL = "http://export.arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending"

API_BASE_URL = "http://localhost:8000/agentic"
UPLOAD_ENDPOINT = f"{API_BASE_URL}/upload_ingest"
API_TOKEN = "your-auth-token-here"

# Concurrency settings
MAX_CONCURRENT_TASKS = 5
MAX_RETRIES = 3
RETRY_DELAY = 2


async def download_random_arxiv_ai_paper(
    session: aiohttp.ClientSession,
) -> tuple[str, str]:
    """Download random arXiv AI paper as local temp file."""

    try:
        async with session.get(ARXIV_AI_QUERY_URL) as response:
            response.raise_for_status()
            text = await response.text()
    except Exception as e:
        logger.error(f"Failed to fetch arXiv papers: {e}")
        raise

    root = ET.fromstring(text)
    entries = root.findall("{http://www.w3.org/2005/Atom}entry")
    if not entries:
        raise RuntimeError("No AI papers found.")

    chosen_entry = random.choice(entries)
    title_elem = chosen_entry.find("{http://www.w3.org/2005/Atom}title")
    title = title_elem.text.strip() if title_elem is not None else "Unknown Title"

    pdf_url = None
    for link in chosen_entry.findall("{http://www.w3.org/2005/Atom}link"):
        if link.attrib.get("title") == "pdf":
            pdf_url = link.attrib["href"]
            break

    if not pdf_url:
        raise RuntimeError("No PDF link found.")

    try:
        async with session.get(pdf_url) as pdf_response:
            pdf_response.raise_for_status()
            pdf_content = await pdf_response.read()
    except Exception as e:
        logger.error(f"Failed to download PDF from {pdf_url}: {e}")
        raise

    temp_file = NamedTemporaryFile(delete=False, suffix=".pdf")  # noqa: SIM115
    temp_file.write(pdf_content)
    temp_file.flush()
    temp_file.close()

    return temp_file.name, title


async def upload_paper_with_retry(
    session: aiohttp.ClientSession, collection_id: str, file_path: str, file_name: str
) -> Optional[dict]:
    """Upload paper with retry logic."""

    for attempt in range(MAX_RETRIES):
        try:
            with open(file_path, "rb") as f:
                form = aiohttp.FormData()
                form.add_field(
                    "input_file", f, filename=file_name, content_type="application/pdf"
                )
                form.add_field("file_name", file_name)

                upload_url = f"http://localhost:8000/agentic/upload_ingest?collection_id={collection_id}"
                async with session.post(upload_url, data=form) as resp:
                    if resp.status == 201:
                        logger.info(f"✅ Uploaded {file_name}")
                        return await resp.json()
                    else:
                        error_text = await resp.text()
                        logger.warning(
                            f"❌ Upload attempt {attempt + 1} failed: {resp.status} — {error_text}"
                        )

                        if attempt < MAX_RETRIES - 1:
                            await asyncio.sleep(
                                RETRY_DELAY * (attempt + 1)
                            )  # Exponential backoff
                        else:
                            logger.error(
                                f"❌ Upload failed after {MAX_RETRIES} attempts: {file_name}"
                            )

        except Exception as e:
            logger.error(f"❌ Upload attempt {attempt + 1} error for {file_name}: {e}")
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(RETRY_DELAY * (attempt + 1))

    return None


async def get_session_cookie() -> Optional[str]:
    """Perform single login and return session cookie value."""
    login_payload = {"username": "piang", "password": "piang"}

    connector = aiohttp.TCPConnector(
        limit=10,
        limit_per_host=5,
        ttl_dns_cache=300,
        use_dns_cache=True,
    )
    timeout = aiohttp.ClientTimeout(total=60, connect=10)

    try:
        async with aiohttp.ClientSession(  # noqa: SIM117
            connector=connector, timeout=timeout
        ) as session:  # noqa: SIM117
            async with session.post(
                "http://localhost:8000/auth/login?remember_me=true",
                json=login_payload,
                headers={"accept": "application/json"},
            ) as resp:
                if resp.status != 200:
                    logger.error(f"Login failed: {await resp.text()}")
                    return None

                # Extract cookie value
                cookies = session.cookie_jar.filter_cookies(
                    "http://localhost:8000/docs"
                )
                if "session" not in cookies:
                    logger.error("No session cookie received.")
                    return None

                cookie_value = cookies["session"].value
                logger.info(
                    f"✅ Logged in successfully — session cookie: {cookie_value[:30]}..."
                )
                return cookie_value

    except Exception as e:
        logger.error(f"❌ Login failed: {e}")
        return None


def create_session_with_cookie(cookie_value: str) -> aiohttp.ClientSession:
    """Create a new session with the shared cookie."""
    connector = aiohttp.TCPConnector(
        limit=10,
        limit_per_host=5,
        ttl_dns_cache=300,
        use_dns_cache=True,
    )
    timeout = aiohttp.ClientTimeout(total=60, connect=10)

    # Create session
    session = aiohttp.ClientSession(connector=connector, timeout=timeout)

    # Manually set the session cookie
    session.cookie_jar.update_cookies(
        {"session": cookie_value}, response_url=URL("http://localhost:8000")
    )

    return session


async def process_single_paper(
    semaphore: asyncio.Semaphore,
    collection_id: str,
    paper_index: int,
    cookie_value: str,
) -> bool:
    """Process a single paper: download, upload, and cleanup."""
    async with semaphore:  # Limit concurrent operations
        logger.info(f"🔄 Starting paper {paper_index + 1}")

        file_path = None
        try:
            # Create session with shared cookie
            session = create_session_with_cookie(cookie_value)

            try:
                # Download paper
                file_path, title = await download_random_arxiv_ai_paper(session)
                logger.info(f"📥 Downloaded: {title}")

                # Upload paper
                result = await upload_paper_with_retry(
                    session, collection_id, file_path, title
                )

                if result:
                    logger.info(
                        f"✅ Successfully processed paper {paper_index + 1}: {title}"
                    )
                    return True
                else:
                    logger.error(
                        f"❌ Failed to process paper {paper_index + 1}: {title}"
                    )
                    return False

            finally:
                # Close session
                await session.close()

        except Exception as e:
            logger.error(f"❌ Error processing paper {paper_index + 1}: {e}")
            return False
        finally:
            # Cleanup temporary file
            if file_path and os.path.exists(file_path):
                try:
                    os.unlink(file_path)
                except Exception as e:
                    logger.warning(f"⚠️ Failed to cleanup temp file {file_path}: {e}")


async def ingest_multiple_random_arxiv_papers_concurrent(
    collection_id: str, num_papers: int
):
    """Ingest multiple papers concurrently with limited parallelism and shared cookie."""
    logger.info(
        f"🚀 Starting concurrent ingestion of {num_papers} papers with {MAX_CONCURRENT_TASKS} max concurrent tasks"
    )

    # Perform single login to get shared cookie
    logger.info("🔐 Performing single login to get shared session cookie...")
    cookie_value = await get_session_cookie()
    if not cookie_value:
        logger.error("❌ Failed to obtain session cookie. Aborting.")
        return

    logger.info("✅ Session cookie obtained successfully. Starting concurrent tasks...")

    # Create semaphore to limit concurrent operations
    semaphore = asyncio.Semaphore(MAX_CONCURRENT_TASKS)

    # Create tasks for all papers with shared cookie
    tasks = [
        process_single_paper(semaphore, collection_id, i, cookie_value)
        for i in range(num_papers)
    ]

    try:
        # Execute all tasks concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Count successes and failures
        successes = sum(1 for result in results if result is True)
        failures = num_papers - successes

        logger.info(
            f"🎯 Ingestion completed: {successes} successful, {failures} failed out of {num_papers} papers"
        )
        logger.info(
            f"📊 Performance: Used 1 login for {num_papers} papers across {MAX_CONCURRENT_TASKS} concurrent threads"
        )

    except Exception as e:
        logger.error(f"❌ Unexpected error during concurrent ingestion: {e}")


# Legacy function for backward compatibility
async def ingest_multiple_random_arxiv_papers_with_session_cookie(
    collection_id: str, num_papers: int
):
    """Legacy function - redirects to concurrent implementation."""
    logger.warning(
        "Using legacy function name - redirecting to concurrent implementation"
    )
    await ingest_multiple_random_arxiv_papers_concurrent(collection_id, num_papers)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Ingest random arXiv AI papers via API (Optimized with 5 concurrent threads)"
    )
    parser.add_argument(
        "collection_id", type=str, help="Collection ID to ingest papers into"
    )
    parser.add_argument(
        "--num_papers", type=int, default=3, help="Number of papers to ingest"
    )
    parser.add_argument(
        "--max_concurrent",
        type=int,
        default=5,
        help="Maximum concurrent tasks (default: 5)",
    )

    args = parser.parse_args()

    # Update global setting if specified
    if args.max_concurrent:
        MAX_CONCURRENT_TASKS = args.max_concurrent
        logger.info(f"🔧 Set max concurrent tasks to: {MAX_CONCURRENT_TASKS}")

    try:
        asyncio.run(
            ingest_multiple_random_arxiv_papers_concurrent(
                args.collection_id, args.num_papers
            )
        )
    except KeyboardInterrupt:
        logger.info("🛑 Interrupted by user")
    except Exception as e:
        logger.error(f"💥 Fatal error: {e}")
