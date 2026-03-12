from __future__ import annotations

import asyncio
import os

from aiogram import Bot, Dispatcher
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, Message, WebAppInfo

BOT_TOKEN = os.getenv('MINI_APP_BOT_TOKEN', '')
MINI_APP_URL = os.getenv('MINI_APP_URL', 'https://your-public-url.example')


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
        await dp.start_polling(bot)
    finally:
        await bot.session.close()


if __name__ == '__main__':
    asyncio.run(main())
