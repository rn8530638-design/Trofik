import { NextResponse } from 'next/server';

// TODO: заменить логирование name, phone, comment, service и serviceType на реальную интеграцию с CRM, когда система будет согласована с клиентом (см. ТЗ, п. 3.6)
export async function POST(request) {
  try {
    const { name, phone, comment = '', service = '', serviceType = '' } = await request.json();
    // Имя и телефон обязательны; комментарий и услуга — нет.
    const digits = String(phone ?? '').replace(/\D/g, '');
    if (!String(name ?? '').trim() || digits.length < 10) {
      return NextResponse.json({ success: false, error: 'name and phone are required' }, { status: 400 });
    }
    console.log('New lead:', { name, phone, comment, service, serviceType, timestamp: new Date().toISOString() });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
