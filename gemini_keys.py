import os
import sys
import time
from typing import List, Optional

class GeminiKeyManager:
    """
    Manages a pool of Gemini API keys.
    Automatically detects multiple keys from comma-separated strings or numbered env variables.
    Handles seamless rotation when daily limits (429 RESOURCE_EXHAUSTED) are encountered.
    """
    def __init__(self):
        self._keys: List[str] = []
        self._current_index: int = 0
        self._exhausted_keys: dict = {}  # key -> timestamp
        self._cooldown_seconds: int = 3600  # 1 hour cooldown before re-testing an exhausted key
        self.reload_keys()

    def reload_keys(self) -> List[str]:
        """Scans environment variables to discover all configured Gemini / Google API keys."""
        discovered: List[str] = []

        # 1. Comma / semicolon-separated strings in standard env variables
        candidate_env_vars = [
            "GEMINI_API_KEY",
            "GEMINI_API_KEYS",
            "GOOGLE_API_KEY",
            "GOOGLE_API_KEYS"
        ]
        for var_name in candidate_env_vars:
            val = os.getenv(var_name, "").strip()
            if val:
                # Handle comma, semicolon, or newline separated keys
                parts = [k.strip().strip("'\"") for k in val.replace(";", ",").replace("\n", ",").split(",") if k.strip()]
                for p in parts:
                    if p and p not in discovered and len(p) > 10:
                        discovered.append(p)

        # 2. Numbered keys: GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.
        for prefix in ["GEMINI_API_KEY_", "GOOGLE_API_KEY_"]:
            for i in range(1, 20):
                k = os.getenv(f"{prefix}{i}", "").strip().strip("'\"")
                if k and k not in discovered and len(k) > 10:
                    discovered.append(k)

        self._keys = discovered
        self._current_index = 0
        
        # Set primary active key in environment
        if self._keys:
            active = self._keys[0]
            os.environ["GEMINI_API_KEY"] = active
            os.environ["GOOGLE_API_KEY"] = active
            
        return self._keys

    @property
    def total_keys(self) -> int:
        return len(self._keys)

    @property
    def current_index(self) -> int:
        return self._current_index

    def mask_key(self, key: str) -> str:
        """Returns masked representation of key (e.g. AIzaSy...nXHw)."""
        if not key or len(key) < 10:
            return "..."
        return f"{key[:6]}...{key[-4:]}"

    def get_active_key(self) -> Optional[str]:
        """Returns the currently active API key, updating os.environ."""
        if not self._keys:
            self.reload_keys()
            if not self._keys:
                return None

        # Check if current key is exhausted and can be advanced
        active = self._keys[self._current_index]
        if self._is_exhausted(active):
            # Try to find a non-exhausted key
            next_key = self.rotate_key(reason="Current key in cooldown")
            if next_key:
                return next_key

        os.environ["GEMINI_API_KEY"] = active
        os.environ["GOOGLE_API_KEY"] = active
        return active

    def _is_exhausted(self, key: str) -> bool:
        if key not in self._exhausted_keys:
            return False
        elapsed = time.time() - self._exhausted_keys[key]
        if elapsed > self._cooldown_seconds:
            # Cooldown expired, key can be tested again
            del self._exhausted_keys[key]
            return False
        return True

    def mark_exhausted(self, key: Optional[str] = None, reason: str = "Daily limit / 429 reached") -> None:
        """Marks a key as exhausted."""
        target_key = key or (self._keys[self._current_index] if self._keys else None)
        if target_key:
            self._exhausted_keys[target_key] = time.time()
            sys.stderr.write(
                f"\n[Key Rotator] Key #{self._current_index + 1} ({self.mask_key(target_key)}) marked exhausted. Reason: {reason}\n"
            )

    def rotate_key(self, reason: str = "Quota limit reached") -> Optional[str]:
        """
        Rotates to the next available API key in the pool.
        Returns the new active key or None if all keys are exhausted.
        """
        if not self._keys:
            return None

        current_key = self._keys[self._current_index]
        self.mark_exhausted(current_key, reason)

        # Check if we have multiple keys
        if len(self._keys) == 1:
            sys.stderr.write(f"[Key Rotator] Only 1 key configured. Cannot rotate.\n")
            return current_key

        # Search for next non-exhausted key
        for step in range(1, len(self._keys)):
            next_idx = (self._current_index + step) % len(self._keys)
            candidate = self._keys[next_idx]
            if not self._is_exhausted(candidate):
                self._current_index = next_idx
                active = candidate
                os.environ["GEMINI_API_KEY"] = active
                os.environ["GOOGLE_API_KEY"] = active
                sys.stderr.write(
                    f"[Key Rotator] Successfully rotated to Key #{next_idx + 1}/{len(self._keys)} ({self.mask_key(active)})\n"
                )
                return active

        # If all keys are currently exhausted, reset oldest cooldown
        sys.stderr.write("[Key Rotator] Warning: All configured keys have hit quota. Using next key in round-robin.\n")
        self._current_index = (self._current_index + 1) % len(self._keys)
        active = self._keys[self._current_index]
        os.environ["GEMINI_API_KEY"] = active
        os.environ["GOOGLE_API_KEY"] = active
        return active

# Global singleton instance
key_manager = GeminiKeyManager()
