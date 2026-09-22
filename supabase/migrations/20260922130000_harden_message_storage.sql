-- Defensive constraints for inbound/outbound WhatsApp records.
alter table public.whatsapp_messages
  drop constraint if exists whatsapp_messages_wa_from_check,
  drop constraint if exists whatsapp_messages_body_check,
  drop constraint if exists whatsapp_messages_type_check,
  drop constraint if exists whatsapp_messages_status_check;

alter table public.whatsapp_messages
  add constraint whatsapp_messages_wa_from_check check (char_length(wa_from) between 3 and 32),
  add constraint whatsapp_messages_body_check check (body is null or char_length(body) <= 4000),
  add constraint whatsapp_messages_type_check check (char_length(message_type) between 1 and 32),
  add constraint whatsapp_messages_status_check check (char_length(status) between 1 and 32);
