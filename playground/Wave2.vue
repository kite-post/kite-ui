<script setup lang="ts">
import { Mail, MapPin, Search } from '@lucide/vue'
import { ref } from 'vue'

import {
  KCard,
  KCardContent,
  KCardHeader,
  KCheckbox,
  KCheckboxGroup,
  KField,
  KInput,
  KRadio,
  KRadioGroup,
  KSelect,
  KSkeleton,
  KSwitch,
  KTextarea,
} from '../src'

const name = ref('Ольга Ковальчук')
const email = ref('olha@example.com')
const weight = ref('35')
const comment = ref('Крихке: всередині скляна банка з медом.')
const insure = ref<boolean | 'indeterminate'>(false)
const channels = ref(['push', 'email'])
const payer = ref<string | null>('sender')
const tariff = ref<string | null>('standard')
const notify = ref(true)
const vacation = ref(false)
const reason = ref<string | null>(null)
const reason2 = ref<string | null>('size')
const reasons = [
  { value: 'changed-mind', label: 'Передумав' },
  { value: 'size', label: 'Не підійшов розмір' },
  { value: 'damaged', label: 'Товар пошкоджений', description: 'Додайте фото до претензії' },
  { value: 'wrong', label: 'Не те, що замовляв' },
  { value: 'expired', label: 'Прострочено', disabled: true, group: 'Лише для продуктів' },
]
</script>

<template>
  <h2 class="k:m-0 k:font-display k:text-h2">Хвиля 2</h2>
  <KCard>
    <KCardHeader title="KField · KInput · KTextarea" />
    <KCardContent class="k:grid k:gap-5 k:md:grid-cols-2">
      <KField label="Ім’я отримувача" hint="Як у документі — його перевірять при видачі">
        <KInput v-model="name" autocomplete="name" clearable />
      </KField>
      <KField label="Email" optional>
        <KInput v-model="email" type="email" :leading-icon="Mail" clearable />
      </KField>
      <KField label="Вага" error="Посилка — до 30 кг. Для більшої ваги оберіть тип «Вантаж»">
        <KInput v-model="weight" suffix="кг" inputmode="decimal" />
      </KField>
      <KField label="Місто">
        <KInput :leading-icon="MapPin" placeholder="Київ" size="lg" />
      </KField>
      <KField label="Пошук у таблиці" hide-label>
        <KInput :leading-icon="Search" placeholder="Номер або телефон" size="sm" />
      </KField>
      <KField label="Пароль"><KInput type="password" model-value="secret-1" /></KField>
      <KField label="Недоступне" disabled><KInput model-value="disabled" /></KField>
      <KField label="Тільки читання" readonly><KInput model-value="Київ, відділення №1" /></KField>
      <KField label="Коментар для відділення" optional class="k:md:col-span-2">
        <KTextarea v-model="comment" :maxlength="200" show-count />
      </KField>
      <KField
        label="Назва магазину"
        orientation="horizontal"
        hint="Її бачать отримувачі в SMS"
        class="k:md:col-span-2"
      >
        <KInput model-value="Чайна лавка" />
      </KField>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="KSelect" />
    <KCardContent class="k:grid k:gap-5 k:md:grid-cols-3">
      <KField label="Причина повернення"><KSelect v-model="reason" :options="reasons" /></KField>
      <KField label="Причина (з очищенням)"
        ><KSelect v-model="reason2" :options="reasons" clearable
      /></KField>
      <KField label="Хто платить" error="Оберіть, хто платить за доставку">
        <KSelect :model-value="null" :options="reasons" />
      </KField>
      <KField label="Недоступно" disabled><KSelect model-value="size" :options="reasons" /></KField>
      <KField label="Малий"><KSelect model-value="size" :options="reasons" size="sm" /></KField>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="KCheckbox · KCheckboxGroup · KRadioGroup · KSwitch" />
    <KCardContent class="k:grid k:gap-6 k:md:grid-cols-2">
      <div class="k:grid k:gap-3">
        <KCheckbox
          v-model="insure"
          label="Застрахувати посилку"
          description="0,5 % від оголошеної вартості — 7 ₴"
        />
        <KCheckbox model-value="indeterminate" label="Обрати всі на сторінці" />
        <KCheckbox invalid label="Я погоджуюся з умовами доставки" />
        <KCheckbox disabled label="Післяплата (недоступна для Kite Box)" />
        <KCheckbox disabled :model-value="true" label="Вимкнено й обрано" />
        <KCheckbox size="sm" :model-value="true" label="Малий чекбокс" />
      </div>
      <KCheckboxGroup
        v-model="channels"
        label="Куди надсилати сповіщення"
        hint="Хоча б один канал"
        :options="[
          { value: 'push', label: 'Push у застосунку' },
          { value: 'email', label: 'Email' },
          { value: 'sms', label: 'SMS' },
        ]"
      />
      <KRadioGroup v-model="payer" label="Хто платить за доставку" orientation="horizontal">
        <KRadio value="sender" label="Відправник" />
        <KRadio value="recipient" label="Отримувач" />
        <KRadio value="business" label="Бізнес-рахунок" disabled />
      </KRadioGroup>
      <div class="k:grid k:gap-1">
        <KSwitch v-model="notify" label="Сповіщення email" description="Статуси ваших посилок" />
        <KSwitch
          v-model="vacation"
          label="Режим відпустки"
          description="Посилки чекатимуть до 14 днів"
        />
        <KSwitch :model-value="true" loading label="Вебхук активний" description="Зберігається…" />
        <KSwitch disabled label="Двофакторний вхід" description="Налаштовує адміністратор" />
      </div>
      <KRadioGroup
        v-model="tariff"
        label="Тариф"
        variant="card"
        :columns="3"
        class="k:md:col-span-2"
      >
        <KRadio value="standard" label="Стандарт" description="До відділення, 2–3 дні">
          <template #aside>80 ₴</template>
        </KRadio>
        <KRadio value="express" label="Експрес" description="Завтра до 18:00">
          <template #aside>140 ₴</template>
        </KRadio>
        <KRadio value="box" label="Kite Box" description="У поштомат, 2–3 дні">
          <template #aside>65 ₴</template>
        </KRadio>
      </KRadioGroup>
    </KCardContent>
  </KCard>

  <KCard>
    <KCardHeader title="KSkeleton" />
    <KCardContent class="k:grid k:gap-4 k:md:grid-cols-2">
      <div class="k:flex k:gap-3">
        <KSkeleton shape="circle" width="40px" />
        <KSkeleton :lines="2" class="k:flex-1" />
      </div>
      <KSkeleton shape="rect" height="56px" />
      <KSkeleton :lines="3" />
    </KCardContent>
  </KCard>
</template>
