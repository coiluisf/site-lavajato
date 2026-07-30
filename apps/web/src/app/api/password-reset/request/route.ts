import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/password-reset/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || 'Erro ao solicitar reset de senha' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Email de recuperação enviado' });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { message: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}
