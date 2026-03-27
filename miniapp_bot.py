from __future__ import annotations

import asyncio
import logging
import os
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse

from aiogram import Bot, Dispatcher
from aiogram.filters import Command, CommandStart
from aiogram.types import BotCommand, InlineKeyboardButton, InlineKeyboardMarkup, Message, WebAppInfo


LOGGER = logging.getLogger("miniapp_bot")
ROOT_DIR = Path(__file__).resolve().parent
ENV_FILE = ROOT_DIR / ".env"
LOCAL_HOSTS = {"localhost", "127.0.0.1"}


@dataclass(frozen=True)
class BotConfig:
    bot_token: str
    mini_app_url: str
    button_text: str
    welcome_text: str


def load_env_file(file_path: Path) -> None:
    if not file_path.exists():
        return

    for raw_line in file_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip("'").strip('"')

        if key:
            os.environ.setdefault(key, value)


def normalize_url(url: str) -> str:
    value = str(url or "").strip()
    if not value:
        raise RuntimeError("Set MINI_APP_URL before start")

    parsed = urlparse(value)
    if parsed.scheme not in {"https", "http"} or not parsed.netloc:
        raise RuntimeError("MINI_APP_URL must be an absolute URL")

    is_local_http = parsed.scheme == "http" and parsed.hostname in LOCAL_HOSTS
    if parsed.scheme != "https" and not is_local_http:
        raise RuntimeError("Telegram Mini App requires HTTPS URL (except localhost)")

    return value.rstrip("/")


def load_config() -> BotConfig:
    load_env_file(ENV_FILE)

    bot_token = str(os.getenv("MINI_APP_BOT_TOKEN") or "").strip()
    if not bot_token:
        raise RuntimeError("Set MINI_APP_BOT_TOKEN before start")

    mini_app_url = normalize_url(os.getenv("MINI_APP_URL") or "")
    button_text = str(os.getenv("MINI_APP_BUTTON_TEXT") or "Открыть Mini App").strip() or "Открыть Mini App"
    welcome_text = (
        str(
            os.getenv("MINI_APP_WELCOME_TEXT")
            or "Откройте мини-приложение по кнопке ниже. Если кнопка не сработала, отправьте /miniapp."
        ).strip()
        or "Откройте мини-приложение по кнопке ниже. Если кнопка не сработала, отправьте /miniapp."
    )

    return BotConfig(
        bot_token=bot_token,
        mini_app_url=mini_app_url,
        button_text=button_text,
        welcome_text=welcome_text,
    )


def build_keyboard(config: BotConfig) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=config.button_text,
                    web_app=WebAppInfo(url=config.mini_app_url),
                )
            ]
        ]
    )


def build_welcome_message(config: BotConfig) -> str:
    return (
        "Это бот для запуска Mini App.\n"
        f"{config.welcome_text}\n\n"
        f"Ссылка: {config.mini_app_url}"
    )


def create_dispatcher(config: BotConfig) -> Dispatcher:
    dp = Dispatcher()

    async def send_launcher(message: Message) -> None:
        await message.answer(
            build_welcome_message(config),
            reply_markup=build_keyboard(config),
        )

    @dp.message(CommandStart())
    async def start_handler(message: Message) -> None:
        await send_launcher(message)

    @dp.message(Command("miniapp"))
    async def miniapp_handler(message: Message) -> None:
        await send_launcher(message)

    @dp.message(Command("help"))
    async def help_handler(message: Message) -> None:
        await message.answer(
            "Команды:\n"
            "/start - показать кнопку запуска\n"
            "/miniapp - открыть кнопку повторно\n"
            "/help - показать эту справку"
        )

    return dp


async def configure_bot(bot: Bot) -> None:
    await bot.set_my_commands(
        [
            BotCommand(command="start", description="Запустить Mini App"),
            BotCommand(command="miniapp", description="Показать кнопку Mini App"),
            BotCommand(command="help", description="Справка"),
        ]
    )


async def main() -> None:
    logging.basicConfig(
        level=os.getenv("MINI_APP_BOT_LOG_LEVEL", "INFO").upper(),
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )

    config = load_config()
    bot = Bot(config.bot_token)
    dp = create_dispatcher(config)

    try:
        LOGGER.info("Starting bot with Mini App URL %s", config.mini_app_url)
        await bot.delete_webhook(drop_pending_updates=True)
        await configure_bot(bot)
        await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())
    finally:
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
