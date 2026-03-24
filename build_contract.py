#!/usr/bin/env python3
"""
Сборка единого документа: Договор + Приложения (ТЗ, Калплан, Акт).
CosmetikaLux — Пакет 250 000₽, 5 этапов, 33 календарных дня.

Запуск: python3 build_contract.py
"""

from contract_base import create_document
from contract_body import build_contract_body
from contract_appendix import (
    build_requisites, build_appendix_tz,
    build_appendix_calendar, build_appendix_act
)

OUTPUT = 'Договор_Cosmetikalux_250k_с_ТЗ.docx'


def main():
    # 1. Создаём документ с настроенными стилями
    doc = create_document()

    # 2. Тело договора (разделы 1–13)
    build_contract_body(doc)

    # 3. Реквизиты + раздел 14
    build_requisites(doc)

    # 4. Приложение №1 — Техническое задание
    build_appendix_tz(doc)

    # 5. Приложение №2 — Календарный план
    build_appendix_calendar(doc)

    # 6. Приложение №3 — Акт приёмки-передачи
    build_appendix_act(doc)

    # Сохранение
    doc.save(OUTPUT)
    print(f'✓ Единый документ создан: {OUTPUT}')
    print(f'  Стоимость: 250 000 ₽ (50% + 50%)')
    print(f'  Этапов: 5')
    print(f'  Срок: 33 календарных дня')
    print(f'  Содержание:')
    print(f'    - Договор (разделы 1–14)')
    print(f'    - Приложение №1: Техническое задание')
    print(f'    - Приложение №2: Календарный план')
    print(f'    - Приложение №3: Акт приёмки-передачи')


if __name__ == '__main__':
    main()
