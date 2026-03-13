from __future__ import annotations

import asyncio
import os

from aiogram import Bot, Dispatcher
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, Message, WebAppInfo

# Local fallback values for IDE run (PyCharm). Keep empty when committing.
LOCAL_BOT_TOKEN = '8776383520:AAGvLivwHXWYFuamTzQPHGlnBl734H4bsG8'
LOCAL_MINI_APP_URL = 'https://miniapp-2uq.surge.sh'

BOT_TOKEN = os.getenv('MINI_APP_BOT_TOKEN') or LOCAL_BOT_TOKEN
MINI_APP_URL = os.getenv('MINI_APP_URL') or LOCAL_MINI_APP_URL


def build_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text='Открыть Mini App',
                    web_app=WebAppInfo(url=MINI_APP_URL),
                )
            ]
        ]
    )


def create_dispatcher() -> Dispatcher:
    dp = Dispatcher()

    @dp.message(Command('start'))
    async def start_handler(message: Message) -> None:
        await message.answer(
            'Это отдельный тестовый бот для MiniApp.\n'
            f'URL: {MINI_APP_URL}',
            reply_markup=build_keyboard(),
        )

    @dp.message(Command('miniapp'))
    async def miniapp_handler(message: Message) -> None:
        await start_handler(message)

    return dp


async def main() -> None:
    if not BOT_TOKEN:
        raise RuntimeError('Set MINI_APP_BOT_TOKEN before start')

    bot = Bot(BOT_TOKEN)
    dp = create_dispatcher()

    try:
        # Ensure polling mode has exclusive access to updates.
        await bot.delete_webhook(drop_pending_updates=True)
        await dp.start_polling(bot)
    finally:
        await bot.session.close()


if __name__ == '__main__':
    asyncio.run(main())
