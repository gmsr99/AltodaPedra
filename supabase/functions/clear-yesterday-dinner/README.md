# Supabase Edge Function: Clear Yesterday's Dinner

Esta função corre automaticamente todos os dias à meia-noite (00:00) e limpa o jantar do dia anterior.

## Como funciona

1. Calcula qual foi o dia de ontem
2. Limpa o `user_id` e `dish` desse dia na tabela `weekly_dinners`
3. Regista no log qual dia foi limpo

## Deploy

### 1. Instalar Supabase CLI

```bash
brew install supabase/tap/supabase
```

### 2. Login no Supabase

```bash
supabase login
```

### 3. Link ao projeto

```bash
supabase link --project-ref <your-project-ref>
```

### 4. Deploy da função

```bash
supabase functions deploy clear-yesterday-dinner
```

### 5. Configurar Cron Job

No dashboard do Supabase:
1. Vai a **Database** → **Cron Jobs** (ou usa pg_cron extension)
2. Cria um novo cron job:

```sql
-- Enable pg_cron extension (se ainda não estiver ativo)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Criar cron job para correr todos os dias à meia-noite
SELECT cron.schedule(
  'clear-yesterday-dinner',
  '0 0 * * *', -- Todos os dias às 00:00
  $$
  SELECT
    net.http_post(
      url:='https://<your-project-ref>.supabase.co/functions/v1/clear-yesterday-dinner',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer <your-anon-key>"}'::jsonb
    ) as request_id;
  $$
);
```

## Testar manualmente

```bash
curl -X POST 'https://<your-project-ref>.supabase.co/functions/v1/clear-yesterday-dinner' \
  -H 'Authorization: Bearer <your-anon-key>' \
  -H 'Content-Type: application/json'
```

## Verificar logs

```bash
supabase functions logs clear-yesterday-dinner
```
