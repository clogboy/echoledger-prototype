# config.py
class Settings:
    def __init__(self):
        self.project_name = "EchoLedger"
        self.default_storage_type = "in_memory"  # Future: "blockchain" or "filecoin"

settings = Settings()
